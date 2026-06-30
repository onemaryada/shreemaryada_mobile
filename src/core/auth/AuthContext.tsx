import React, { createContext, useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { firebaseAuth } from '../firebase';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, user, isLoading }) => {
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
