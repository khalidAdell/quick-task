import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJHK9mRvxpRg39un5q8M_yEqenzqfUnBQ",
  authDomain: "quick-task-e9996.firebaseapp.com",
  projectId: "quick-task-e9996",
  storageBucket: "quick-task-e9996.firebasestorage.app",
  messagingSenderId: "338711506501",
  appId: "1:338711506501:web:ce3099fe177dd69fe6fd2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
