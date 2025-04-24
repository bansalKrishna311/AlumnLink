import Contact from "../models/contact.model.js";

// Create a new contact submission
export const createContactSubmission = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Create new contact entry
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });
    
    // Save to database
    await newContact.save();
    
    res.status(201).json({ 
      success: true,
      message: "Your message has been sent successfully" 
    });
  } catch (error) {
    console.error("Error creating contact submission:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to send message. Please try again later."
    });
  }
};

// Get all contact submissions (for admin/superadmin)
export const getContactSubmissions = async (req, res) => {
  try {
    // Get status filter from query params
    const { status } = req.query;
    
    // Create filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    // Fetch contacts with optional filtering
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 });
    
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update contact status and add response
export const respondToContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { status, response } = req.body;
    
    if (!contactId || !status || !response) {
      return res.status(400).json({ message: "Contact ID, status and response are required" });
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        status,
        response,
        respondedBy: req.user._id,
        respondedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }
    
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};