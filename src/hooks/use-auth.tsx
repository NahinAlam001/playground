
"use client";
import type { User as CustomUser } from '@/types'; // Renamed to avoid conflict with Firebase User
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  Auth,
  User as FirebaseUser, // Firebase's User type
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  AuthProvider as FirebaseAuthProvider // Alias to avoid conflict
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase'; // Import the initialized auth instance
import { useToast } from './use-toast';

type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
  login: (type: 'email' | 'google' | 'github', email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>; // Made email/password required
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: CustomUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: any, context: string) => {
    console.error(`${context} failed`, error);
    let description = "An unexpected error occurred. Please try again.";
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          description = 'Invalid email or password.';
          break;
        case 'auth/email-already-in-use':
          description = 'This email address is already in use.';
          break;
        case 'auth/weak-password':
          description = 'The password is too weak.';
          break;
        case 'auth/popup-closed-by-user':
            description = 'Login process was cancelled.';
            break;
        case 'auth/cancelled-popup-request':
            description = 'Login process was cancelled. Please try again.';
            break;
        case 'auth/account-exists-with-different-credential':
            description = 'An account already exists with this email address using a different sign-in method.';
            break;
        default:
          description = error.message || description;
      }
    }
    toast({ title: `${context} Failed`, description, variant: "destructive" });
    throw error; // Re-throw to allow UI to handle loading state
  }

  const loginWithProvider = async (provider: FirebaseAuthProvider, providerName: 'Google' | 'GitHub') => {
    setLoading(true);
    try {
      await signInWithPopup(firebaseAuth, provider);
      // onAuthStateChanged will handle setting the user
      toast({ title: `${providerName} Login Successful`, description: "Welcome!"});
    } catch (error) {
      handleAuthError(error, `${providerName} Login`);
    } finally {
      // setLoading(false) // onAuthStateChanged handles final loading state
    }
  }

  const login = async (type: 'email' | 'google' | 'github', email?: string, password?: string): Promise<void> => {
    setLoading(true);
    if (type === 'email') {
      if (!email || !password) {
        const err = new Error("Email and password are required for email login.");
        handleAuthError(err, "Login");
        setLoading(false); // Ensure loading is false if pre-check fails
        return Promise.reject(err);
      }
      try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        // onAuthStateChanged will handle setting the user
        toast({ title: "Login Successful", description: "Welcome back!" });
      } catch (error) {
        handleAuthError(error, "Email Login");
      } finally {
        // setLoading(false) // onAuthStateChanged handles final loading state
      }
    } else if (type === 'google') {
      const googleProvider = new GoogleAuthProvider();
      await loginWithProvider(googleProvider, 'Google');
    } else if (type === 'github') {
      const githubProvider = new GithubAuthProvider();
      await loginWithProvider(githubProvider, 'GitHub');
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(firebaseAuth);
      // onAuthStateChanged will handle setting user to null
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      handleAuthError(error, "Logout");
    } finally {
      // setLoading(false) // onAuthStateChanged handles final loading state
    }
  };
  
  const register = async (email: string, password: string): Promise<void> => {
    setLoading(true);
     if (!email || !password) {
        const err = new Error("Email and password are required for registration.");
        handleAuthError(err, "Registration");
        setLoading(false); // Ensure loading is false if pre-check fails
        return Promise.reject(err);
      }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // onAuthStateChanged will handle setting the user
      toast({ title: "Registration Successful", description: "Welcome to Profile Forge!" });
    } catch (error) {
      handleAuthError(error, "Registration");
    } finally {
      // setLoading(false) // onAuthStateChanged handles final loading state
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
