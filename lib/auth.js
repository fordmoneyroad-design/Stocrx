import { supabase, getCurrentUser, getUserProfile } from './supabase.js';

export const signUp = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: 'user'
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: userData.phone,
          date_of_birth: userData.dateOfBirth,
          address: userData.address,
          drivers_license: userData.driversLicense,
          license_state: userData.licenseState,
          marketing_emails: userData.marketingEmails || false
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { error };
  }
};

export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { data: null, error };
  }
};

export const checkAuth = async () => {
  const user = await getCurrentUser();
  return !!user;
};

export const requireAuth = async (redirectUrl = '/login.html') => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
};

export const requireAdmin = async (redirectUrl = '/login.html') => {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }

  const profile = await getUserProfile(user.id);
  if (profile?.role !== 'admin') {
    alert('Admin access required');
    window.location.href = '/index.html';
    return false;
  }
  return true;
};
