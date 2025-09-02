import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserData } from '../firebase/auth';
import { isDemoMode, demoAuth } from '../firebase/demoService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    
    console.log('AuthContext: Setting up auth listener, isDemoMode:', isDemoMode());
    
    if (isDemoMode()) {
      // Demo mode - simulate auth state
      unsubscribe = demoAuth.onAuthStateChanged(async (user) => {
        console.log('AuthContext: Demo auth state changed:', user);
        if (user) {
          setCurrentUser(user);
          // Fetch user data
          const result = await getUserData(user.uid);
          console.log('AuthContext: User data result:', result);
          if (result.success) {
            setUserData(result.data);
            console.log('AuthContext: User data set:', result.data);
          }
        } else {
          console.log('AuthContext: No user, clearing state');
          setCurrentUser(null);
          setUserData(null);
        }
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      });
    } else {
      // Real Firebase auth
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('AuthContext: Firebase auth state changed:', user);
        if (user) {
          setCurrentUser(user);
          // Fetch user data from Firestore
          const result = await getUserData(user.uid);
          if (result.success) {
            setUserData(result.data);
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
        setLoading(false);
      });
    }

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    setUserData,
    isDemoMode: isDemoMode()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
