// controllers/instituteController.js
import User from '../models/user.model.js';

export const getInstitutes = async (req, res) => {
  try {
    const institutes = await User.find({ adminType: 'institute' });
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching institutes', error });
  }
};


export const getSchools = async (req, res) => {
    try {
      const schools = await User.find({ adminType: 'school' });
      res.status(200).json(schools);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching schools', error });
    }
  };

  export const getCorporate = async (req, res) => {
    try {
      const corporates = await User.find({ adminType: 'corporate' });
      res.status(200).json(corporates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching corporates', error });
    }
  };

  export const getAdminCourses = async (req, res) => {
    try {
      const { adminId } = req.params;
      
      if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
      }

      const admin = await User.findById(adminId).select('assignedCourses name adminType role');
      
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      if (admin.role !== 'admin') {
        return res.status(400).json({ message: 'User is not an admin' });
      }

      res.status(200).json({
        adminId: admin._id,
        adminName: admin.name,
        adminType: admin.adminType,
        assignedCourses: admin.assignedCourses || []
      });
    } catch (error) {
      console.error('Error fetching admin courses:', error);
      res.status(500).json({ message: 'Error fetching admin courses', error: error.message });
    }
  };

  // Utility endpoint to update admin courses (for testing)
  export const updateAdminCourses = async (req, res) => {
    try {
      const { adminId } = req.params;
      const { assignedCourses } = req.body;
      
      if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
      }

      if (!assignedCourses || !Array.isArray(assignedCourses)) {
        return res.status(400).json({ message: 'assignedCourses must be an array' });
      }

      const admin = await User.findById(adminId);
      
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      if (admin.role !== 'admin') {
        return res.status(400).json({ message: 'User is not an admin' });
      }

      admin.assignedCourses = assignedCourses;
      await admin.save();

      res.status(200).json({
        message: 'Admin courses updated successfully',
        adminId: admin._id,
        adminName: admin.name,
        assignedCourses: admin.assignedCourses
      });
    } catch (error) {
      console.error('Error updating admin courses:', error);
      res.status(500).json({ message: 'Error updating admin courses', error: error.message });
    }
  };

