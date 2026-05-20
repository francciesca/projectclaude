import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'user';
  company_id: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          await fetchProfile(session.user.id);
        })();
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role, company_id')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
      return;
    }

    setProfile(data as Profile | null);
    setIsLoading(false);
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    return !error;
  };

  const signup = async (email: string, password: string, name: string, companyId: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: { name, company_id: companyId, role: 'user' },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    isLoading,
    login,
    signup,
    logout,
    isAdmin: profile?.role === 'admin',
    companyId: profile?.company_id ?? null,
  };
}
