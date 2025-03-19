import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import authService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean; // Ajout de l'état de chargement au contexte
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        // Vérifier si l'utilisateur est valide
        if (currentUser && currentUser.id && currentUser.email) {
          setUser(currentUser);
          console.log("Current user from localStorage:", currentUser);
        } else {
          console.log("No valid user found in localStorage");
          // S'assurer que user est null si on n'a pas trouvé d'utilisateur valide
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // En cas d'erreur, s'assurer que user est null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true); // Indiquer que le chargement est en cours
      const response = await authService.login({ email, password });
      
      if (!response || !response.user) {
        throw new Error("Invalid response format from server");
      }
      
      setUser(response.user);
      // No need to return the response as the function should return void
      return;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false); // Fin du chargement, quelle que soit l'issue
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    setIsLoading(true); // Indiquer que le chargement est en cours
    authService.logout();
    setUser(null);
    setIsLoading(false);
  };

  // Calculer si l'utilisateur est super admin avec gestion null-safe
  const isSuperAdmin = !!user && user.role.toLowerCase() === 'superadmin';

  // Valeurs à exporter dans le contexte
  const contextValue: AuthContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    isSuperAdmin,
    isLoading,
    login,
    logout
  };

  // Journaliser pour le débogage (en développement uniquement)
  if (process.env.NODE_ENV === 'development') {
    console.log("Auth context - user:", user);
    console.log("Auth context - isSuperAdmin:", isSuperAdmin);
    console.log("Auth context - isLoading:", isLoading);
  }

  // Retourner le provider avec tous les enfants, même pendant le chargement
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}