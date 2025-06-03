// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW4S8oxeq5vMz5tlU9RTgZhDbnZLuINM8",
  authDomain: "qms-asn.firebaseapp.com",
  projectId: "qms-asn",
  storageBucket: "qms-asn.firebasestorage.app",
  messagingSenderId: "389932312313",
  appId: "1:389932312313:web:62dec6c8c238d654462428"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, storage, db };
