/**
 * This script initializes the required superuser accounts for the LIMBS Orthopaedic system
 * Run using: tsx scripts/init-superusers.ts
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Role } from "../client/src/hooks/useAuth";

// Firebase configuration 
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBMjLUXangE1ND2NUDBW84SmcDLTiM361s",
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID || "limbsorthopaedic"}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "limbsorthopaedic",
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID || "limbsorthopaedic"}.firebasestorage.app`,
  messagingSenderId: "704165842142",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:704165842142:web:5a247387fae5a0824b864f",
  measurementId: "G-TBN8V8YWJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Define superusers
interface SuperUser {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

const superusers: SuperUser[] = [
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
async function createSuperuser(userData: SuperUser): Promise<boolean> {
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
    
    // Sign out after creating the user
    await signOut(auth);
    
    return true;
  } catch (error: any) {
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