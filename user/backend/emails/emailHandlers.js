import { mailtrapClient, sender } from "../lib/mailtrap.js";
import {
	createCommentNotificationEmailTemplate,
	createLinkAcceptedEmailTemplate,
	createWelcomeEmailTemplate,
	createLikeNotificationEmailTemplate,
	createReplyNotificationEmailTemplate,
	createMentionNotificationEmailTemplate,
	createPostStatusEmailTemplate
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Welcome to AlumnLink – Your Alumni Community Awaits!",
			html: createWelcomeEmailTemplate(name, profileUrl),
			category: "welcome",
		});

		console.log("Welcome Email sent succesffully", response);
	} catch (error) {
		throw error;
	}
};

export const sendCommentNotificationEmail = async (
	recipientEmail,
	recipientName,
	commenterName,
	postUrl,
	commentContent
) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Someone commented on your post in AlumnLink!",
			html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
			category: "comment_notification",
		});
		console.log("Comment Notification Email sent successfully", response);
	} catch (error) {
		throw error;
	}
};

export const sendLinkAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
	const recipient = [{ email: senderEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: `Your alumni connection with ${recipientName} is live!`,
			html: createLinkAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "Link_accepted",
		});
	} catch (error) {}
};

export const sendResetPasswordEmail = async (email, name, resetUrl) => {
	try {
		await mailtrapClient.send({
			from: sender,
			to: [{ email }],
			subject: "Reset Your AlumnLink Password",
			html: `<p>Hi ${name},</p><p>To keep your alumni account secure, please click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a><p>If you did not request this, please ignore this email.</p>`,
		});
	} catch (error) {
		console.error("Error sending reset password email:", error);
		throw error;
	}
};

export const sendLikeNotificationEmail = async (recipientEmail, recipientName, likerName, postUrl, postContent) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Your post received a new reaction on AlumnLink!",
			html: createLikeNotificationEmailTemplate(recipientName, likerName, postUrl, postContent),
			category: "like_notification",
		});
		console.log("Like Notification Email sent successfully", response);
	} catch (error) {
		console.error("Error sending like notification email:", error);
		// Don't throw so we don't interrupt the main execution flow
	}
};

export const sendReplyNotificationEmail = async (recipientEmail, recipientName, replierName, postUrl, replyContent) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Someone replied to your comment on AlumnLink!",
			html: createReplyNotificationEmailTemplate(recipientName, replierName, postUrl, replyContent),
			category: "reply_notification",
		});
		console.log("Reply Notification Email sent successfully", response);
	} catch (error) {
		console.error("Error sending reply notification email:", error);
		// Don't throw so we don't interrupt the main execution flow
	}
};

export const sendMentionNotificationEmail = async (recipientEmail, recipientName, mentionerName, postUrl, postContent) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "You were mentioned in an AlumnLink post!",
			html: createMentionNotificationEmailTemplate(recipientName, mentionerName, postUrl, postContent),
			category: "mention_notification",
		});
		console.log("Mention Notification Email sent successfully", response);
	} catch (error) {
		console.error("Error sending mention notification email:", error);
		// Don't throw so we don't interrupt the main execution flow
	}
};

export const sendPostStatusNotificationEmail = async (recipientEmail, recipientName, reviewerName, postStatus, postUrl, postContent, feedback) => {
	const recipient = [{ email: recipientEmail }];
	const subject = postStatus === 'approved' ? "Your AlumnLink post is now live!" : "Your AlumnLink post was not approved";

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: subject,
			html: createPostStatusEmailTemplate(recipientName, reviewerName, postStatus, postUrl, postContent, feedback),
			category: `post_${postStatus}_notification`,
		});
		console.log(`Post ${postStatus} Notification Email sent successfully`, response);
	} catch (error) {
		console.error(`Error sending post ${postStatus} notification email:`, error);
		// Don't throw so we don't interrupt the main execution flow
	}
};