import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1ErOLTStcLBInfdrfeC22GUvFq7NXbNE",
  authDomain: "quizgameapp-bb7ac.firebaseapp.com",
  projectId: "quizgameapp-bb7ac",
  storageBucket: "quizgameapp-bb7ac.firebasestorage.app",
  messagingSenderId: "605841568583",
  appId: "1:605841568583:web:6d5a218c70a07459d59262",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
