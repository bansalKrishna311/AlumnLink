import express from 'express';
import Contact from '../models/contact.model.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Submit a new contact form (public route)
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide all required fields' 
            });
        }

        // Create new contact submission
        const contact = new Contact({
            name,
            email,
            subject,
            message
        });

        await contact.save();

        res.status(200).json({ 
            success: true,
            message: 'Contact form submitted successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Get all contact requests (superadmin only)
router.get('/', protectRoute, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

// Update contact status and add response (superadmin only)
router.put('/:id/respond', protectRoute, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status, response },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact' });
    }
});

export default router;
