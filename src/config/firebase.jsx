import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhG3qRCDPuj7mUQM0Ohya8D1ET8UOLZZY",
  authDomain: "fir-course-dc33f.firebaseapp.com",
  projectId: "fir-course-dc33f",
  storageBucket: "fir-course-dc33f.appspot.com",
  messagingSenderId: "390049135608",
  appId: "1:390049135608:web:62a07e87246fe98f1e340d",
  measurementId: "G-T7L75VVMJB",
};

// Initialize firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
