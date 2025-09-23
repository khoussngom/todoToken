import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCG9i3IdcIP4jkYO8K3XtBcS4dmQBTyU6c",
  authDomain: "todoreact-dfa73.firebaseapp.com",
  projectId: "todoreact-dfa73",
  storageBucket: "todoreact-dfa73.firebasestorage.app",
  messagingSenderId: "724497097964",
  appId: "1:724497097964:web:9c8473cff673e249dff1c9",
  measurementId: "G-98VFLRTX5M"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };