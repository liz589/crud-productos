// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArUXkJ2MaUHiJwHxd9ChsAJMXnXTHEzV0",
  authDomain: "primerapractica-65d26.firebaseapp.com",
  projectId: "primerapractica-65d26",
  storageBucket: "primerapractica-65d26.firebasestorage.app",
  messagingSenderId: "1039827846295",
  appId: "1:1039827846295:web:8e3fb6d23886a80b0595d2",
  measurementId: "G-TJSLHP8E16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);