import LinkRequest from '../models/LinkRequest.model.js';
import Notification from '../models/notification.model.js';

export const cleanupOldLinkRequests = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Delete link requests that are older than 30 days and have status pending or rejected
        const result = await LinkRequest.deleteMany({
            createdAt: { $lt: thirtyDaysAgo },
            status: { $in: ['pending', 'rejected'] }
        });

        console.log(`Cleaned up ${result.deletedCount} old link requests`);
        return result.deletedCount;
    } catch (error) {
        console.error('Error cleaning up old link requests:', error);
        throw error;
    }
};

export const notifyExpiringRequests = async () => {
    try {
        // Find requests that will expire in 3 days (i.e., are 27 days old)
        const twentySevenDaysAgo = new Date();
        twentySevenDaysAgo.setDate(twentySevenDaysAgo.getDate() - 27);

        const expiringRequests = await LinkRequest.find({
            createdAt: {
                $lt: twentySevenDaysAgo,
                $gt: new Date(twentySevenDaysAgo.getTime() - 24 * 60 * 60 * 1000) // Only get ones we haven't notified about yet
            },
            status: { $in: ['pending', 'rejected'] }
        }).populate('sender', '_id');

        // Create notifications for each request
        const notifications = expiringRequests.map(request => ({
            recipient: request.sender._id,
            type: 'LinkRequestExpiring',
            relatedUser: request.recipient
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            console.log(`Created ${notifications.length} expiration notifications`);
        }

    } catch (error) {
        console.error('Error notifying about expiring requests:', error);
        throw error;
    }
};