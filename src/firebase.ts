import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCf-yEbbWqdytCo3ZMxVrSsximgPLxoo-w",
  authDomain: "prems-creations-9e2be.firebaseapp.com",
  projectId: "prems-creations-9e2be",
  storageBucket: "prems-creations-9e2be.firebasestorage.app",
  messagingSenderId: "208957255376",
  appId: "1:208957255376:web:1ad89ad7bd44eacf2578d5",
  measurementId: "G-GRH07DFDWS",
  databaseURL: "https://prems-creations-9e2be-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function writeUserData(userId: string, name: string, email: string) {
  set(ref(db, "users/" + userId), {
    username: name,
    email: email,
  });
}

export async function readUserData(userId: string) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `users/${userId}`));
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
}
