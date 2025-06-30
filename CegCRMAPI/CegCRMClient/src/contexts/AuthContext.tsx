import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, UserRole, UserInfo } from '../types/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedRole = localStorage.getItem('role') as UserRole | null;
        const token = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');
        
        if (storedRole && token) {
          setRole(storedRole);
          if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
          }
        } else {
          console.warn('Token veya role bulunamadı - kullanıcı giriş yapmamış olabilir');
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        console.warn('Auth state hatası - kullanıcı giriş yapmamış olabilir');
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleSetRole = (newRole: UserRole, userData?: UserInfo) => {
    try {
      setRole(newRole);
      localStorage.setItem('role', newRole);
      
      if (userData) {
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error setting role:', error);
      throw new Error('Failed to set user role');
    }
  };

  const handleLogout = () => {
    try {
      setRole(null);
      setUserInfo(null);
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // You might want to replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={{ 
      role, 
      userInfo,
      setRole: handleSetRole, 
      logout: handleLogout,
      isLoading 
    }}>
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