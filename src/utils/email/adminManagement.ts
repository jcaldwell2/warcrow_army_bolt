
import { supabase } from "@/integrations/supabase/client";
import { AdminUpdateResult, WabAdmin } from "./types";

export const updateUserWabAdminStatus = async (
  userId: string,
  setAsAdmin: boolean
): Promise<AdminUpdateResult> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { 
        success: false, 
        message: "You must be logged in to perform this action"
      };
    }
    
    const { data: adminCheck, error: adminCheckError } = await supabase.rpc(
      'is_wab_admin',
      { user_id: session.user.id }
    );
    
    if (adminCheckError || !adminCheck) {
      console.error('Admin check failed:', adminCheckError);
      return { 
        success: false, 
        message: "You don't have permission to update admin status"
      };
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ wab_admin: setAsAdmin })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating admin status:', error);
      return { 
        success: false, 
        message: `Failed to ${setAsAdmin ? 'grant' : 'revoke'} admin status: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: `Successfully ${setAsAdmin ? 'granted' : 'revoked'} admin privileges` 
    };
  } catch (error) {
    console.error('Unexpected error updating admin status:', error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const getWabAdmins = async (): Promise<WabAdmin[]> => {
  try {
    // First get the admin profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, wab_id')
      .eq('wab_admin', true)
      .order('username');
    
    if (error) {
      console.error('Error fetching wab admins:', error);
      return [];
    }
    
    // Then for each admin, get their email via the RPC function
    const adminsWithEmails = await Promise.all(
      data.map(async (admin) => {
        // Using RPC call to get user email safely
        const { data: userData, error: userError } = await supabase
          .rpc('get_user_email', { user_id: admin.id })
          .single();
        
        return {
          ...admin,
          // If the RPC fails or returns no data, use a fallback
          email: userError ? 'Email not accessible' : (userData?.email || 'No email found')
        };
      })
    );
    
    return adminsWithEmails;
  } catch (error) {
    console.error('Unexpected error fetching wab admins:', error);
    return [];
  }
};
