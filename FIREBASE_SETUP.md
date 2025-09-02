# Firebase Configuration Guide

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `smart-student-hub`
4. Choose to enable/disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Optionally enable "Google" for social login

### 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Done"

### 4. Enable Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as Firestore
5. Click "Done"

### 5. Get Configuration
1. Go to "Project Settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Enter app name: `Smart Student Hub`
5. Click "Register app"
6. Copy the configuration object

### 6. Update Configuration File
Replace the configuration in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Activities rules
    match /activities/{activityId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId || // Student can update their own
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['faculty', 'admin'] // Faculty/Admin can approve
      );
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /activities/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Initial Data Setup

After setting up Firebase, you can add some demo data:

### Demo Users
```javascript
// Add to users collection
{
  uid: "demo-student-id",
  name: "Demo Student",
  email: "student@demo.com",
  role: "student",
  department: "Computer Science",
  rollNumber: "CS2021001",
  credits: 45,
  createdAt: new Date()
}

{
  uid: "demo-faculty-id", 
  name: "Dr. Faculty Demo",
  email: "faculty@demo.com",
  role: "faculty",
  department: "Computer Science",
  credits: 0,
  createdAt: new Date()
}

{
  uid: "demo-admin-id",
  name: "Admin Demo", 
  email: "admin@demo.com",
  role: "admin",
  department: "Administration",
  credits: 0,
  createdAt: new Date()
}
```

### Demo Activities
```javascript
// Add to activities collection
{
  userId: "demo-student-id",
  type: "certification",
  title: "AWS Cloud Practitioner",
  description: "Foundational understanding of AWS Cloud",
  organization: "Amazon Web Services",
  date: "2024-01-15",
  duration: "3 months",
  certificateNumber: "AWS-CP-12345",
  skills: ["Cloud Computing", "AWS", "Infrastructure"],
  proofUrl: "",
  status: "approved",
  remarks: "Excellent achievement!",
  reviewedBy: "demo-faculty-id",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## Environment Variables (Optional)

For production deployment, consider using environment variables:

Create `.env` file:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Then update config.js:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## Deployment

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Other Platforms
- **Netlify**: Connect GitHub repo and deploy
- **Vercel**: Import GitHub repo and deploy
- **Heroku**: Use buildpack for React apps
