import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { 
  isDemoMode, 
  demoLogin, 
  demoRegister, 
  demoLogout, 
  demoGetUserData 
} from './demoService';

// Register new user
export const registerUser = async (email, password, userData) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoRegister(email, password, userData);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: userData.name
    });
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      rollNumber: userData.rollNumber || null,
      phoneNumber: userData.phoneNumber || null,
      credits: 0,
      createdAt: new Date().toISOString(),
      profileComplete: false
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoLogin(email, password);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoLogout();
  }

  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data
export const getUserData = async (uid) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoGetUserData(uid);
  }

  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User data not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
