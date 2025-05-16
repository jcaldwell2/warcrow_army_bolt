import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ResendConfirmationResult, SupabaseAdminUsersResponse, SupabaseUser } from "./types";

/**
 * Test if a specific email account can receive Supabase confirmation emails
 * @param email The email address to test
 * @returns Promise with the result of the operation
 */
export const testConfirmationEmail = async (email: string): Promise<ResendConfirmationResult> => {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please provide a valid email address',
      details: null
    };
  }
  
  try {
    console.log(`Testing confirmation email for: ${email}`);
    
    // First, check if this email is already confirmed in our system
    const { data } = await supabase.auth.admin.listUsers();
    const usersByEmail = data as SupabaseAdminUsersResponse;
    
    const emailAlreadyConfirmed = usersByEmail?.users?.some((user: SupabaseUser) => {
      // TypeScript safe way to check properties
      if (user.email === email && user.user_metadata) {
        const metadata = user.user_metadata;
        return !!metadata.email_confirmed_at;
      }
      return false;
    });
    
    if (emailAlreadyConfirmed) {
      console.log(`Email ${email} is already confirmed in the system`);
      toast.info(`${email} is already confirmed in Supabase. You won't receive a confirmation email.`);
    }
    
    // First, send a direct test email using our edge function to verify Resend is working correctly
    const { data: directEmailData, error: directEmailError } = await supabase.functions.invoke('send-resend-email', {
      body: {
        testConfirmationEmail: true,
        email: email,
        to: [email],
        subject: 'Warcrow - Email Delivery Test',
        html: `
          <h1>Email Delivery Test</h1>
          <p>This is a direct test email to verify that we can use Resend to deliver emails to your account.</p>
          <p>If you are seeing this, it means our direct email system works.</p>
          <p>${emailAlreadyConfirmed 
            ? '<strong>Your email is already confirmed in Supabase, so you will NOT receive a confirmation email.</strong>' 
            : 'You should also receive a separate Supabase authentication email.'}
          </p>
          <p>If you don't receive the authentication email (and your email is not yet confirmed), it's likely because:</p>
          <ul>
            <li>The Resend API key in Supabase SMTP settings is outdated or incorrect</li>
            <li>The SMTP settings in Supabase need to be reconfigured</li>
            <li>Authentication emails are disabled in Supabase settings</li>
          </ul>
          <p><strong>IMPORTANT:</strong> The API key was updated in Edge Functions, but you still need to update it in SMTP settings.</p>
          <p>Update your SMTP settings in Supabase by:</p>
          <ol>
            <li>Going to Authentication → Email Templates → SMTP Settings</li>
            <li>Toggle OFF and then back ON "Enable Custom SMTP"</li>
            <li>For SMTP password, enter your current Resend API key (same one used for Edge Functions)</li>
            <li>The host should be set to "smtp.resend.com" and port to "465" with SSL enabled</li>
            <li>The username should be "resend"</li>
            <li>Save changes and test again</li>
          </ol>
        `
      }
    });
    
    if (directEmailError) {
      console.error('Error sending direct test email:', directEmailError);
      
      if (directEmailError.message?.includes('API key is invalid')) {
        toast.error('Invalid Resend API key detected. Please update it in Supabase Edge Functions settings.');
        return {
          success: false,
          message: 'Your Resend API key is invalid. Please generate a new key at resend.com and update it in Supabase Edge Functions settings.',
          details: {
            errorType: 'invalid_api_key',
            errorMessage: directEmailError.message
          }
        };
      }
      
      toast.error(`Failed to send test email: ${directEmailError.message}`);
      return {
        success: false,
        message: `Error with direct email: ${directEmailError.message}`,
        details: directEmailError
      };
    }
    
    console.log('Direct test email result:', directEmailData);
    
    // Check if the response indicates an invalid API key
    if (directEmailData?.error?.message?.includes('API key is invalid')) {
      toast.error('Invalid Resend API key detected. Please update it in Supabase Edge Functions settings.');
      return {
        success: false,
        message: 'Your Resend API key is invalid. Please generate a new key at resend.com and update it in Supabase Edge Functions settings.',
        details: {
          errorType: 'invalid_api_key',
          errorMessage: directEmailData.error.message
        }
      };
    }
    
    toast.success(`Direct test email sent to ${email}. Check your inbox.`);
    
    // If email is already confirmed, we don't need to try sending a confirmation email
    if (emailAlreadyConfirmed) {
      return {
        success: true,
        message: `Direct test email sent to ${email}. Since this email is already confirmed, no confirmation email was sent.`,
        details: {
          directEmail: directEmailData,
          emailAlreadyConfirmed: true
        }
      };
    }
    
    // Now, use Supabase's built-in email resend functionality
    console.log('Attempting to send Supabase authentication email via auth.resend...');
    
    const { data: resendData, error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    console.log('Supabase auth.resend response:', { data: resendData, error: resendError });
    
    if (resendError) {
      console.error('Error sending Supabase authentication email:', resendError);
      toast.error(`Failed to send Supabase authentication email: ${resendError.message}`);
      return {
        success: false,
        message: `Direct email sent but Supabase auth email failed: ${resendError.message}. Please update SMTP settings in Supabase Authentication → Email Templates → SMTP Settings.`,
        details: {
          directEmail: directEmailData,
          resendError
        }
      };
    }
    
    toast.success(`Supabase authentication email requested for ${email}. Check both inbox and spam folders.`);
    toast.info('IMPORTANT: If you only receive the direct test email but not the authentication email, you MUST update the SMTP settings in Supabase Authentication → Email Templates with the same Resend API key');
    
    return {
      success: true,
      message: `Both test emails sent to ${email}. If you only received the direct test email but not the authentication email, your Supabase SMTP settings need updating.`,
      details: {
        directEmail: directEmailData,
        resendData
      }
    };
  } catch (error) {
    console.error('Error in testConfirmationEmail:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: null
    };
  }
};

/**
 * Resend confirmation emails to all users with unconfirmed email addresses
 * This functionality will be handled by Supabase directly if you use
 * the admin interface. This is just a placeholder for now.
 */
export const resendAllPendingConfirmationEmails = async (): Promise<ResendConfirmationResult> => {
  toast.info('This functionality should be handled in the Supabase Dashboard under Authentication > Users.');
  
  // Add some guidance for SMTP settings
  toast.info('If confirmation emails are not being received, check your SMTP settings in Authentication > Email Templates.');
  toast.warning('IMPORTANT: Make sure your SMTP password in Supabase Auth Templates is updated with the same Resend API key used in Edge Functions');
  
  return {
    success: true,
    message: 'For email delivery issues, try updating your SMTP password (Resend API key) in Supabase Authentication settings.',
    details: null
  };
};

/**
 * Test signup functionality to see if new users can register
 * @param email Test email to use for signup
 * @param password Test password to use for signup
 * @returns Promise with the result of the operation
 */
export const testUserSignup = async (email: string, password: string): Promise<ResendConfirmationResult> => {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please provide a valid email address',
      details: null
    };
  }
  
  if (!password || password.length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters',
      details: null
    };
  }
  
  try {
    console.log(`Testing user signup with email: ${email}`);
    
    // Check if email already exists
    const { data } = await supabase.auth.admin.listUsers();
    const existingUserData = data as SupabaseAdminUsersResponse;
    
    const emailExists = existingUserData?.users?.some((user: SupabaseUser) => {
      return user.email === email;
    });
    
    if (emailExists) {
      console.log(`Email ${email} already exists in the system`);
      return {
        success: false,
        message: `The email ${email} is already registered. Please use a different email to test signup.`,
        details: {
          emailExists: true
        }
      };
    }
    
    // Try to sign up a new user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (signupError) {
      console.error('Error during signup test:', signupError);
      return {
        success: false,
        message: `Signup failed: ${signupError.message}`,
        details: signupError
      };
    }
    
    console.log('Signup test result:', signupData);
    
    // Check if confirmation email was sent
    const emailConfirmationSent = !signupData.user?.email_confirmed_at;
    
    return {
      success: true,
      message: emailConfirmationSent 
        ? `Signup successful! A confirmation email has been sent to ${email}.` 
        : `Signup successful! The account was created but no confirmation email was needed.`,
      details: {
        user: signupData.user,
        emailConfirmationSent
      }
    };
  } catch (error) {
    console.error('Error in testUserSignup:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: null
    };
  }
};
