import { supabase } from "@/integrations/supabase/client";
import React from 'react';

export const checkWabAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { data, error } = await supabase.rpc('is_wab_admin', {
      user_id: userId,
    });

    if (error) {
      console.error('Error checking wab-admin status:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Unexpected error checking wab-admin status:', err);
    return false;
  }
};

export const grantWabAdmin = async (
  adminUserId: string,
  targetUserId: string
): Promise<boolean> => {
  if (!adminUserId || !targetUserId) return false;

  try {
    const isAdmin = await checkWabAdmin(adminUserId);
    if (!isAdmin) {
      console.error('User is not authorized to grant admin privileges');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ wab_admin: true })
      .eq('id', targetUserId);

    if (error) {
      console.error('Error granting wab-admin status:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error granting wab-admin status:', err);
    return false;
  }
};

export const revokeWabAdmin = async (
  adminUserId: string,
  targetUserId: string
): Promise<boolean> => {
  if (!adminUserId || !targetUserId) return false;

  try {
    const isAdmin = await checkWabAdmin(adminUserId);
    if (!isAdmin) {
      console.error('User is not authorized to revoke admin privileges');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ wab_admin: false })
      .eq('id', targetUserId);

    if (error) {
      console.error('Error revoking wab-admin status:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error revoking wab-admin status:', err);
    return false;
  }
};

interface AdminOnlyProps {
  children: React.ReactNode;
  isWabAdmin: boolean;
  fallback?: React.ReactNode;
}

export function AdminOnly(props: AdminOnlyProps) {
  const { children, isWabAdmin, fallback = null } = props;
  
  console.log('AdminOnly component - Access check:', { 
    isWabAdmin, 
    accessGranted: !!isWabAdmin,
    componentDisplayed: isWabAdmin ? 'Admin content' : 'Fallback or null'
  });
  
  if (!isWabAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
