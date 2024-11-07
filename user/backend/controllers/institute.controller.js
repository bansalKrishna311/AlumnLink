// controllers/instituteController.js
import Institute from '../models/user.model.js';

export const getInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find({ adminType: 'institute' });
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching institutes', error });
  }
};
