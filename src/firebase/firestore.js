import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { 
  isDemoMode,
  demoGetUserActivities,
  demoGetPendingActivities,
  demoAddActivity,
  demoUpdateActivity,
  demoUploadFile
} from './demoService';

// Activity Management
export const addActivity = async (userId, activityData) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoAddActivity(userId, activityData);
  }

  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      userId,
      ...activityData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateActivity = async (activityId, updates) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoUpdateActivity(activityId, updates);
  }

  try {
    const docRef = doc(db, 'activities', activityId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteActivity = async (activityId) => {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserActivities = async (userId) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoGetUserActivities(userId);
  }

  try {
    const q = query(
      collection(db, 'activities'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const activities = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, activities };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPendingActivities = async () => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoGetPendingActivities();
  }

  try {
    const q = query(
      collection(db, 'activities'), 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const activities = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, activities };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// File Upload
export const uploadFile = async (file, path) => {
  // Use demo mode if Firebase is not properly configured
  if (isDemoMode()) {
    return await demoUploadFile(file, path);
  }

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
