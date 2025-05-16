
import { sendEmail } from "./sendEmail";
import { EmailOptions } from "./types";
import { toast } from "sonner";

export const testResendEmail = async (email?: string, useDefaultDomain = false) => {
  try {
    console.log("Starting test email procedure...");
    console.log("API key testing initiated");
    
    const options: EmailOptions = {};
    
    if (useDefaultDomain) {
      options.fromEmail = 'onboarding@resend.dev';
      options.fromName = 'Warcrow Test';
      console.log("Using default Resend domain (onboarding@resend.dev)");
    } else {
      console.log("Using custom domain (updates@updates.warcrowarmy.com)");
    }
    
    const testEmailAddress = email || 'caldwejf@gmail.com';
    console.log(`Sending test email to: ${testEmailAddress}`);
    console.log("Preparing to call sendEmail function...");
    
    const result = await sendEmail(
      [testEmailAddress],
      'Resend Test Email',
      '<h1>Test Email from Warcrow Army</h1><p>This is a test email sent via Resend to verify the email service is working.</p>',
      options
    );
    
    // Log the full result for debugging
    console.log("Raw email send result:", JSON.stringify(result, null, 2));
    
    // Check if the response contains an error about invalid API key
    if (result?.error?.message?.includes('API key is invalid')) {
      console.error("API key invalid error detected:", result.error.message);
      toast.error('Invalid Resend API key detected. Please update it in both Supabase Edge Functions settings AND in the Auth Templates SMTP settings.');
      throw new Error('Invalid Resend API key. Please update it in the Supabase dashboard and in Auth Templates SMTP settings.');
    }
    
    // Check if we got any other error
    if (result?.error) {
      console.error("Other error in email response:", result.error);
      toast.error(`Email error: ${result.error.message || 'Unknown error'}`);
      throw new Error(`Email error: ${result.error.message || 'Unknown error'}`);
    }
    
    console.log('Test email sent successfully via Resend:', result);
    toast.success(`Test email sent successfully to ${testEmailAddress}!`);
    return true;
  } catch (error) {
    console.error('Failed to send test email via Resend:', error);
    
    // Provide more helpful error messaging
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key is invalid') || errorMessage.includes('invalid API key')) {
      console.error('API key invalid error detected in catch block');
      toast.error('Please update your Resend API key in BOTH places: 1) Supabase Edge Functions Settings and 2) Auth Templates SMTP Settings');
      toast.info('Make sure your API key starts with "re_" and has no extra spaces');
    } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Failed to send a request to the Edge Function')) {
      toast.error('Network error connecting to Supabase Edge Function. This is likely a temporary issue. Please try again later.');
    } else {
      toast.error(`Failed to send test email: ${errorMessage}`);
    }
    
    throw error;
  }
};
