// Demo Authentication Service for Testing
// This service simulates Firebase authentication without requiring Firebase setup

const DEMO_USERS = [
  {
    uid: 'demo-student-1',
    email: 'student@demo.com',
    displayName: 'Demo Student',
    userData: {
      uid: 'demo-student-1',
      name: 'Demo Student',
      email: 'student@demo.com',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2021001',
      phoneNumber: '+91 9876543210',
      credits: 45,
      createdAt: new Date().toISOString(),
      profileComplete: true
    }
  },
  {
    uid: 'demo-faculty-1',
    email: 'faculty@demo.com',
    displayName: 'Demo Faculty',
    userData: {
      uid: 'demo-faculty-1',
      name: 'Dr. Demo Faculty',
      email: 'faculty@demo.com',
      role: 'faculty',
      department: 'Computer Science',
      phoneNumber: '+91 9876543211',
      credits: 0,
      createdAt: new Date().toISOString(),
      profileComplete: true
    }
  },
  {
    uid: 'demo-admin-1',
    email: 'admin@demo.com',
    displayName: 'Demo Admin',
    userData: {
      uid: 'demo-admin-1',
      name: 'Demo Administrator',
      email: 'admin@demo.com',
      role: 'admin',
      department: 'Administration',
      phoneNumber: '+91 9876543212',
      credits: 0,
      createdAt: new Date().toISOString(),
      profileComplete: true
    }
  }
];

// Demo Activities Data
const DEMO_ACTIVITIES = [
  {
    id: 'activity-1',
    userId: 'demo-student-1',
    type: 'certification',
    title: 'AWS Cloud Practitioner',
    description: 'Completed AWS Cloud Practitioner certification course covering cloud concepts, security, and pricing.',
    organization: 'Amazon Web Services',
    date: '2024-01-15',
    duration: '40 hours',
    certificateNumber: 'AWS-CP-2024-001',
    skills: ['AWS', 'Cloud Computing', 'DevOps'],
    proofUrl: 'https://example.com/demo-certificate.pdf',
    status: 'approved',
    createdAt: { toDate: () => new Date('2024-01-20') },
    updatedAt: { toDate: () => new Date('2024-01-22') }
  },
  {
    id: 'activity-2',
    userId: 'demo-student-1',
    type: 'internship',
    title: 'Software Development Intern',
    description: 'Worked on React.js and Node.js applications during summer internship.',
    organization: 'Tech Solutions Pvt Ltd',
    date: '2024-05-01',
    duration: '3 months',
    certificateNumber: 'INTERN-2024-001',
    skills: ['React.js', 'Node.js', 'JavaScript', 'Git'],
    proofUrl: 'https://example.com/internship-certificate.pdf',
    status: 'pending',
    createdAt: { toDate: () => new Date('2024-08-15') },
    updatedAt: { toDate: () => new Date('2024-08-15') }
  },
  {
    id: 'activity-3',
    userId: 'demo-student-1',
    type: 'competition',
    title: 'Smart India Hackathon 2024',
    description: 'Developed Smart Student Hub platform for education sector problem statement.',
    organization: 'Government of India',
    date: '2024-09-01',
    duration: '36 hours',
    certificateNumber: 'SIH-2024-WINNER',
    skills: ['React.js', 'Firebase', 'UI/UX Design', 'Problem Solving'],
    proofUrl: 'https://example.com/sih-certificate.pdf',
    status: 'approved',
    createdAt: { toDate: () => new Date('2024-09-02') },
    updatedAt: { toDate: () => new Date('2024-09-02') }
  }
];

let currentUser = null;
let currentUserData = null;
let authStateCallbacks = [];

export const demoAuth = {
  // Simulate Firebase auth state
  get currentUser() {
    return currentUser;
  },
  onAuthStateChanged: (callback) => {
    authStateCallbacks.push(callback);
    // Immediately call with current state
    callback(currentUser);
    return () => {
      authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback);
    };
  }
};

// Helper to trigger auth state change
const triggerAuthStateChange = () => {
  authStateCallbacks.forEach(callback => {
    callback(currentUser);
  });
};

// Demo Authentication Functions
export const demoLogin = async (email, password) => {
  console.log('Demo login attempt:', email);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (password !== 'demo123') {
    console.log('Invalid password');
    return { success: false, error: 'Invalid password. Use "demo123"' };
  }
  
  const demoUser = DEMO_USERS.find(user => user.email === email);
  if (!demoUser) {
    console.log('User not found');
    return { success: false, error: 'User not found. Use demo credentials.' };
  }
  
  console.log('Demo user found:', demoUser);
  
  currentUser = {
    uid: demoUser.uid,
    email: demoUser.email,
    displayName: demoUser.displayName
  };
  
  currentUserData = demoUser.userData;
  
  console.log('Setting current user:', currentUser);
  console.log('Triggering auth state change immediately');
  
  // Trigger auth state change immediately
  triggerAuthStateChange();
  
  return { success: true, user: currentUser };
};

export const demoRegister = async (email, password, userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if user already exists
  const existingUser = DEMO_USERS.find(user => user.email === email);
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }
  
  const newUser = {
    uid: 'demo-new-' + Date.now(),
    email: email,
    displayName: userData.name,
    userData: {
      ...userData,
      uid: 'demo-new-' + Date.now(),
      credits: 0,
      createdAt: new Date().toISOString(),
      profileComplete: false
    }
  };
  
  DEMO_USERS.push(newUser);
  
  currentUser = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName
  };
  
  currentUserData = newUser.userData;
  
  // Trigger auth state change
  triggerAuthStateChange();
  
  return { success: true, user: currentUser };
};

export const demoLogout = async () => {
  currentUser = null;
  currentUserData = null;
  
  // Trigger auth state change
  triggerAuthStateChange();
  
  return { success: true };
};

export const demoGetUserData = async (uid) => {
  const user = DEMO_USERS.find(user => user.uid === uid);
  if (user) {
    return { success: true, data: user.userData };
  }
  return { success: false, error: 'User data not found' };
};

export const demoGetUserActivities = async (userId) => {
  const userActivities = DEMO_ACTIVITIES.filter(activity => activity.userId === userId);
  return { success: true, activities: userActivities };
};

export const demoGetPendingActivities = async () => {
  const pendingActivities = DEMO_ACTIVITIES.filter(activity => activity.status === 'pending');
  return { success: true, activities: pendingActivities };
};

export const demoAddActivity = async (userId, activityData) => {
  const newActivity = {
    id: 'demo-activity-' + Date.now(),
    userId,
    ...activityData,
    status: 'pending',
    createdAt: { toDate: () => new Date() },
    updatedAt: { toDate: () => new Date() }
  };
  
  DEMO_ACTIVITIES.push(newActivity);
  return { success: true, id: newActivity.id };
};

export const demoUpdateActivity = async (activityId, updates) => {
  const activityIndex = DEMO_ACTIVITIES.findIndex(activity => activity.id === activityId);
  if (activityIndex !== -1) {
    DEMO_ACTIVITIES[activityIndex] = {
      ...DEMO_ACTIVITIES[activityIndex],
      ...updates,
      updatedAt: { toDate: () => new Date() }
    };
    return { success: true };
  }
  return { success: false, error: 'Activity not found' };
};

export const demoUploadFile = async (file, path) => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a demo URL
  return { 
    success: true, 
    url: `https://demo-storage.com/${path}/${file.name}` 
  };
};

// Check if we should use demo mode
export const isDemoMode = () => {
  // Check if Firebase config has demo values
  const config = {
    apiKey: "AIzaSyDemoKeyForDevelopment1234567890"
  };
  return config.apiKey.includes('Demo');
};
