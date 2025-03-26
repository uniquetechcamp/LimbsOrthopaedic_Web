const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile 
} = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Define superusers
const superusers = [
  {
    fullName: 'Lawrence Otieno',
    email: 'cybertechocean@gmail.com',
    password: 'L@HhZ5LGZYkr1d.KtzFxXUmP',
    role: 'owner'
  },
  {
    fullName: 'Collins Otieno',
    email: 'collinsokoth71@gmail.com',
    password: 'Col!Rtpz7L@HKt3Ts',
    role: 'owner'
  }
];

// Function to create a superuser
async function createSuperuser(userData) {
  try {
    console.log(`Creating superuser account for ${userData.fullName}...`);
    
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: userData.fullName,
    });
    
    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: userData.fullName,
      role: userData.role,
      createdAt: new Date(),
    });
    
    console.log(`✅ Successfully created superuser: ${userData.fullName} (${userData.email})`);
    return true;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️ User ${userData.email} already exists.`);
    } else {
      console.error(`❌ Error creating superuser ${userData.fullName}:`, error);
    }
    return false;
  }
}

// Create all superusers
async function createAllSuperusers() {
  console.log('Starting superuser creation...');
  
  for (const user of superusers) {
    await createSuperuser(user);
  }
  
  console.log('Superuser creation process completed.');
  process.exit(0);
}

createAllSuperusers().catch(error => {
  console.error('Fatal error during superuser creation:', error);
  process.exit(1);
});