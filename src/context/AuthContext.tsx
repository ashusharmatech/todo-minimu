
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (session) {
          const { user } = session;
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name,
          });
          
          // Show toast on email confirmation
          if (event === 'SIGNED_IN' && user.email_confirmed_at) {
            toast({
              title: "Email verified",
              description: "Your email has been verified successfully.",
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const { user } = session;
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata.name,
        });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been logged in",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // Get the full URL for email confirmation
      const redirectUrl = `${window.location.origin}/auth/confirm`;
      console.log('Redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth/confirm`;
      console.log('Google redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during Google login",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
