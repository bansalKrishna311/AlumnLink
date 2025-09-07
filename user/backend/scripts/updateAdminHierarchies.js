// Quick script to update admin hierarchy levels
// Run this in backend console if needed

import User from '../models/user.model.js';

const updateAdminHierarchies = async () => {
  try {
    // Update all admins to have proper hierarchy levels
    const instituteAdmins = await User.updateMany(
      { role: "admin", adminType: "institute", adminHierarchy: { $exists: false } },
      { $set: { adminHierarchy: "institute_management" } }
    );

    const schoolAdmins = await User.updateMany(
      { role: "admin", adminType: "school", adminHierarchy: { $exists: false } },
      { $set: { adminHierarchy: "school_management" } }
    );

    const corporateAdmins = await User.updateMany(
      { role: "admin", adminType: "corporate", adminHierarchy: { $exists: false } },
      { $set: { adminHierarchy: "corporate_management" } }
    );

    console.log('Updated institute admins:', instituteAdmins.modifiedCount);
    console.log('Updated school admins:', schoolAdmins.modifiedCount);
    console.log('Updated corporate admins:', corporateAdmins.modifiedCount);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating admin hierarchies:', error);
    return { success: false, error };
  }
};

export default updateAdminHierarchies;
