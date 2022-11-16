// Import the functions you need from the SDKs you need
// import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCkkjO3GktO5a7LwgoCxTctnsUiagnjbto',
  authDomain: 'task-manager-18c05.firebaseapp.com',
  projectId: 'task-manager-18c05',
  storageBucket: 'task-manager-18c05.appspot.com',
  messagingSenderId: '1043475530186',
  appId: '1:1043475530186:web:2c1cab9929a1543b954f33',
  measurementId: 'G-43D43WCEKP'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
