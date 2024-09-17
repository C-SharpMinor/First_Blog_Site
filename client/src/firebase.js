// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, //this is the same thing as process.env but the vite version
  authDomain: "first-mern-blog-4c853.firebaseapp.com",
  projectId: "first-mern-blog-4c853",
  storageBucket: "first-mern-blog-4c853.appspot.com",
  messagingSenderId: "191126686343",
  appId: "1:191126686343:web:198c0554294e42b74dc622"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);