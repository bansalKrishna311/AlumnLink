import express from 'express';
import Contact from '../models/contact.model.js';

const router = express.Router();

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

export default router;
