import React, { createContext, useState, useEffect } from 'react';
import {auth} from '@/config/fireBase.config'
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const UserContext = createContext();
import { useRouter } from 'next/router';


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Successfully signed in:', user);
        return userCredential; // Return the userCredential object
    } catch (error) {
        console.error('Error signing in:', error);
        // Handle specific error codes here
        if (error.code === "auth/user-not-found") {
            toast.error('Email or Password not Found. Try Again!');
        } else if (error.code === "auth/wrong-password") {
            toast.error('Wrong Password. Try Again!');
        } else if (error.code === "auth/invalid-email") {
            toast.error("Invalid Email Format. Try Again!");
        } else if (error.code === "auth/too-many-requests") {
            toast.error("Too many failed attempts. Refresh and try again!");
        } else {
            // Handle other errors or display a generic error message
            toast.error('Failed to Sign in. Check credentials and try again!');
        }

        throw error; // Re-throw the error
    }
};


  const handleSignout = async () => {
    console.log("hit")
    try {
      await signOut(auth);
      router.push('/SignIn')
      localStorage.removeItem('user');
      setUser(null);
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const contextValue = {
    user,
    handleSignin,
    handleSignout,
	setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
