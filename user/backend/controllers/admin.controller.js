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


export const getSchools = async (req, res) => {
    try {
      const schools = await Institute.find({ adminType: 'school' });
      res.status(200).json(schools);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching schools', error });
    }
  };

  export const getCorporate = async (req, res) => {
    try {
      const corporates = await Institute.find({ adminType: 'corporate' });
      res.status(200).json(corporates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching corporates', error });
    }
  };

