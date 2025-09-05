import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SubAdminContext = createContext();

export const SubAdminProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [targetAdminId, setTargetAdminId] = useState(null);

  useEffect(() => {
    const adminId = searchParams.get('adminId');
    console.log('🔍 SubAdminContext - URL adminId parameter:', adminId);
    console.log('🔍 SubAdminContext - Full URL search params:', searchParams.toString());
    console.log('🔍 SubAdminContext - All URL params:', Object.fromEntries(searchParams));
    console.log('🔍 SubAdminContext - Current URL:', window.location.href);
    setTargetAdminId(adminId);
  }, [searchParams]);

  return (
    <SubAdminContext.Provider value={{ targetAdminId, setTargetAdminId }}>
      {children}
    </SubAdminContext.Provider>
  );
};

export const useSubAdmin = () => {
  const context = useContext(SubAdminContext);
  if (!context) {
    throw new Error('useSubAdmin must be used within a SubAdminProvider');
  }
  return context;
};
