import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      let errorMessage = "An error occurred during signup";
      if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        errorMessage =
          "Email already exists. Please use a different email or log in.";
      } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      let errorMessage = "An error occurred during login";
      if (error.code === AuthErrorCodes.INVALID_EMAIL) {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === AuthErrorCodes.WRONG_PASSWORD) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
