import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig,);
export const auth = getAuth(app);
export const signUpFunction = (organizationName,email,password,organizationType,state) => {
  return createUserWithEmailAndPassword(auth, email, password).then(() => {
    return updateProfile(auth.currentUser, {
      displayName: `${organizationName} ${email} ${password} ${organizationType} ${state}`
    });
  });
};
export const signInFunction = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
export const signOutFunction = () => {
  return signOut(auth);
};
export const database = getFirestore(app);
export const organizationCollection = collection(database, "organization");
