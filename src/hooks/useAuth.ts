import { useState, useEffect } from 'react';
import { User } from '../types';

const VALID_CREDENTIALS = {
  'cabal': { password: 'cabal123', role: 'admin' as const, name: 'Administrador Cabal' },
  'usuario': { password: 'usuario123', role: 'user' as const, name: 'Usuario Regular' }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on component mount
    const checkSavedUser = () => {
      try {
        const savedUser = localStorage.getItem('fleetUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('Loaded saved user:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('fleetUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Trim whitespace from inputs
      const trimmedUsername = username.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log('Attempting login with:', { username: trimmedUsername });

      const credentials = VALID_CREDENTIALS[trimmedUsername as keyof typeof VALID_CREDENTIALS];
      
      if (credentials && credentials.password === trimmedPassword) {
        const userData: User = {
          username: trimmedUsername,
          role: credentials.role,
          name: credentials.name
        };
        
        console.log('Login successful, saving user:', userData);
        
        // Save to localStorage first
        localStorage.setItem('fleetUser', JSON.stringify(userData));
        
        // Then set user state - this will trigger a re-render
        setUser(userData);
        
        return true;
      }
      
      console.log('Invalid credentials for username:', trimmedUsername);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
  try {
    console.log('Logging out user');
    localStorage.removeItem('fleetUser');
    setUser(null);
    setTimeout(() => {
      window.location.reload();
    }, 100);
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error)
  }
}

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin'
  };
}