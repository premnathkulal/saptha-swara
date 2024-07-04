// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiEdWKRy5qnrJic1ly2Buf0D1A9zHYRJw",
  authDomain: "sapta-swara.firebaseapp.com",
  projectId: "sapta-swara",
  storageBucket: "sapta-swara.appspot.com",
  messagingSenderId: "1097239085790",
  appId: "1:1097239085790:web:bf7e58da5e4011a2c7b84f",
  measurementId: "G-DLM3YK7C6K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getDatabase(app);
