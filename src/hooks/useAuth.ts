import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  auth,
  googleProvider,
} from "../firebase";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  setAuthUser,
  clearAuthUser,
  showToastMessage,
} from "../store/slices/app-slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setAuthUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          }),
        );
      } else {
        dispatch(clearAuthUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      dispatch(showToastMessage("Signed in with Google"));
    } catch {
      dispatch(showToastMessage("Sign in failed"));
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      dispatch(showToastMessage("Signed out"));
    } catch {
      dispatch(showToastMessage("Sign out failed"));
    }
  };

  return { signInWithGoogle, signOut };
};
