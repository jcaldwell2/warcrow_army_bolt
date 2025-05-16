
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  testResendEmail, 
  checkDomainVerificationStatus, 
  resendAllPendingConfirmationEmails, 
  DomainVerificationResult,
  testConfirmationEmail,
  testUserSignup,
  SupabaseUser,
  SupabaseAdminUsersResponse
} from "@/utils/email";
import { ArrowLeft, AlertTriangle, ExternalLink, InfoIcon, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { supabase } from "@/integrations/supabase/client";

const Mail = () => {
  const navigate = useNavigate();
  const [domainStatus, setDomainStatus] = useState<DomainVerificationResult>({ 
    verified: false, 
    status: 'Checking...', 
    domains: [] 
  });
  const [testEmail, setTestEmail] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [isResendingAll, setIsResendingAll] = useState(false);
  const [isTestingConfirmation, setIsTestingConfirmation] = useState(false);
  const [isAPIKeyValid, setIsAPIKeyValid] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [smtpMismatchDetected, setSmtpMismatchDetected] = useState(false);
  const [emailAlreadyConfirmed, setEmailAlreadyConfirmed] = useState(false);
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isTestingSignup, setIsTestingSignup] = useState(false);

  useEffect(() => {
    checkDomainStatus();
  }, []);

  const checkDomainStatus = async () => {
    try {
      const status = await checkDomainVerificationStatus();
      setDomainStatus(status);
      
      setIsAPIKeyValid(true);
    } catch (error: any) {
      console.error("Failed to check domain status:", error);
      
      if (error.message?.includes('API key is invalid')) {
        setIsAPIKeyValid(false);
        toast.error('Invalid Resend API key detected. Please update it in Supabase.');
      } else {
        toast.error(`Failed to check domain status: ${error.message}`);
      }
      
      setDomainStatus({ verified: false, status: `Error: ${error.message}`, domains: [] });
    }
  };

  const checkIfEmailConfirmed = async (email: string): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.admin.listUsers();
      const userData = data as SupabaseAdminUsersResponse;
      
      return userData?.users?.some((user: SupabaseUser) => {
        return user.email === email && user.user_metadata?.email_confirmed_at;
      }) || false;
    } catch (error) {
      console.error("Error checking if email is confirmed:", error);
      return false;
    }
  };

  const handleTestEmail = async () => {
    try {
      setIsSending(true);
      const emailToUse = testEmail.trim() || undefined;
      await testResendEmail(emailToUse);
      toast.success(`Test email sent successfully${emailToUse ? ` to ${emailToUse}` : ''}!`);
      setIsAPIKeyValid(true);
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      
      if (error.message?.includes('API key is invalid')) {
        setIsAPIKeyValid(false);
        toast.error('Invalid Resend API key detected. Please update it in Supabase.');
      } else {
        toast.error(`Failed to send test email: ${error.message}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleResendConfirmations = async () => {
    try {
      setIsResendingAll(true);
      const result = await resendAllPendingConfirmationEmails();
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Failed to resend confirmation emails:", error);
      toast.error(`Failed to resend confirmation emails: ${error.message}`);
    } finally {
      setIsResendingAll(false);
    }
  };

  const handleTestConfirmationEmail = async () => {
    if (!confirmationEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    try {
      setIsTestingConfirmation(true);
      
      const isConfirmed = await checkIfEmailConfirmed(confirmationEmail);
      setEmailAlreadyConfirmed(isConfirmed);
      
      if (isConfirmed) {
        toast.info(`${confirmationEmail} is already confirmed in Supabase. You'll only receive the direct test email.`);
      }
      
      const result = await testConfirmationEmail(confirmationEmail);
      console.log("Test confirmation email result:", result);
      
      if (!result.success) {
        if (result.details?.errorType === 'invalid_api_key') {
          setIsAPIKeyValid(false);
        }
        toast.error(result.message);
      } else {
        setIsAPIKeyValid(true);
        
        if (result.details?.emailAlreadyConfirmed) {
          toast.success("Direct test email sent. Check your inbox!");
          toast.info("No confirmation email was sent because this email is already confirmed in Supabase.");
        } else {
          toast.success("Test emails requested. Check your inbox for delivery results.");
          
          if (result.details?.directEmail && !result.details?.resendData?.user) {
            setSmtpMismatchDetected(true);
            setTimeout(() => {
              toast.warning("⚠️ SMTP SETUP ISSUE DETECTED: Your direct email works but Supabase authentication emails don't.");
            }, 1000);
            
            setTimeout(() => {
              toast.info("You need to update your SMTP settings in Supabase Auth Templates to use the same Resend API key.");
            }, 2000);
          }
        }
      }
    } catch (error: any) {
      console.error("Failed to test confirmation email:", error);
      
      if (error.message?.includes('API key is invalid')) {
        setIsAPIKeyValid(false);
        toast.error('Invalid Resend API key detected. Please update it in Supabase.');
      } else {
        toast.error(`Failed to test confirmation email: ${error.message}`);
      }
    } finally {
      setIsTestingConfirmation(false);
    }
  };

  const handleTestUserSignup = async () => {
    if (!signupEmail || !signupPassword) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsTestingSignup(true);
      
      const result = await testUserSignup(signupEmail, signupPassword);
      console.log("Test user signup result:", result);
      
      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        
        setSignupEmail('');
        setSignupPassword('');
      }
    } catch (error: any) {
      console.error("Failed to test user signup:", error);
      toast.error(`Failed to test signup: ${error.message}`);
    } finally {
      setIsTestingSignup(false);
    }
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title="Mail Management" />
      
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/admin')}
            className="mr-4 border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-warcrow-gold">Mail Management</h1>
        </div>
        
        {isAPIKeyValid === false && (
          <Card className="p-6 border border-red-500 shadow-sm bg-red-900/20 mb-6">
            <div className="flex items-start mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <h2 className="text-lg font-semibold text-red-400">Invalid Resend API Key Detected</h2>
            </div>
            <p className="text-sm text-warcrow-text mb-4">
              Your Resend API key appears to be invalid. You need to update it in two places:
            </p>
            <ol className="text-sm text-warcrow-text list-decimal pl-5 space-y-1 mb-4">
              <li>First, go to <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Resend.com API Keys</a> and generate a new API key</li>
              <li>Next, update the key in <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/settings/functions" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Supabase Edge Functions Settings</a> (RESEND_API_KEY)</li>
              <li>Then go to <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Auth Templates</a> in Supabase</li>
              <li>Toggle OFF and back ON the "Enable Custom SMTP" setting</li>
              <li>Update the SMTP password with the same new Resend API key</li>
            </ol>
            <Button 
              onClick={checkDomainStatus}
              className="w-full border-red-400 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:border-red-300"
            >
              Verify API Key Again
            </Button>
          </Card>
        )}

        {emailAlreadyConfirmed && (
          <Card className="p-6 border border-blue-500 shadow-sm bg-blue-900/20 mb-6">
            <div className="flex items-start mb-2">
              <InfoIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
              <h2 className="text-lg font-semibold text-blue-400">Email Already Confirmed</h2>
            </div>
            <p className="text-sm text-warcrow-text mb-4">
              The email address "{confirmationEmail}" is already confirmed in Supabase. This means:
            </p>
            <ul className="text-sm text-warcrow-text list-disc pl-5 space-y-1 mb-4">
              <li>You will receive the direct test email (which tests the Resend API connection)</li>
              <li>You will NOT receive a confirmation email because your email is already verified</li>
              <li>This is normal behavior - confirmation emails are only sent to unconfirmed email addresses</li>
            </ul>
            <p className="text-sm text-warcrow-text mb-4">
              To fully test both email types, use an email address that hasn't been confirmed in your Supabase project yet.
            </p>
          </Card>
        )}

        {smtpMismatchDetected && (
          <Card className="p-6 border border-yellow-500 shadow-sm bg-yellow-900/20 mb-6">
            <div className="flex items-start mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <h2 className="text-lg font-semibold text-yellow-400">SMTP Configuration Issue Detected</h2>
            </div>
            <p className="text-sm text-warcrow-text mb-4">
              Your Edge Function Resend API key is working, but Supabase authentication emails are not being delivered.
              This means your SMTP settings in Supabase Auth Templates need to be updated with the same Resend API key.
            </p>
            <ol className="text-sm text-warcrow-text list-decimal pl-5 space-y-1 mb-4">
              <li>Go to <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline flex items-center">Supabase Auth Templates <ExternalLink className="h-3 w-3 ml-1" /></a></li>
              <li>Scroll down to SMTP Settings and click "Edit"</li>
              <li>Toggle OFF "Enable Custom SMTP" and save</li>
              <li>Toggle back ON "Enable Custom SMTP"</li>
              <li>Make sure host is "smtp.resend.com" and port is "465" with SSL enabled</li>
              <li>Username should be "resend"</li>
              <li>For the SMTP password, enter the SAME Resend API key you used in Edge Functions</li>
              <li>Save changes and test confirmation emails again</li>
            </ol>
            <Button 
              onClick={() => setSmtpMismatchDetected(false)}
              className="w-full border-yellow-400 bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 hover:border-yellow-300"
            >
              I've Updated SMTP Settings
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Domain Verification Status</h2>
            <div className="space-y-2 mb-4">
              <p className="text-warcrow-text">Status: <span className={domainStatus.verified ? "text-green-400" : "text-yellow-400"}>{domainStatus.status}</span></p>
              <p className="text-warcrow-text">Verified: <span className={domainStatus.verified ? "text-green-400" : "text-yellow-400"}>{domainStatus.verified ? 'Yes' : 'No'}</span></p>
              <p className="text-warcrow-text">API Key: <span className={isAPIKeyValid === true ? "text-green-400" : isAPIKeyValid === false ? "text-red-400" : "text-yellow-400"}>{isAPIKeyValid === true ? 'Valid' : isAPIKeyValid === false ? 'Invalid' : 'Unknown'}</span></p>
            </div>
            <Button 
              onClick={checkDomainStatus} 
              className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
            >
              Check Again
            </Button>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Send Test Email</h2>
            <p className="text-sm text-warcrow-muted mb-4 text-center">
              Send a test email to verify your email configuration is working correctly.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="testEmail" className="block text-sm font-medium text-warcrow-text mb-1">
                  Email Address (optional)
                </label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full mb-4 bg-black border-warcrow-gold/30 text-warcrow-text"
                />
              </div>
              <Button 
                onClick={handleTestEmail}
                className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Test Authentication Emails</h2>
            <p className="text-sm text-warcrow-muted mb-4 text-center">
              Test Supabase's authentication email system by sending both a direct test email and 
              a Supabase authentication email. This helps diagnose SMTP configuration issues.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="confirmationEmail" className="block text-sm font-medium text-warcrow-text mb-1">
                  Email Address
                </label>
                <Input
                  id="confirmationEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={confirmationEmail}
                  onChange={(e) => {
                    setConfirmationEmail(e.target.value);
                    setEmailAlreadyConfirmed(false);
                  }}
                  className="w-full mb-4 bg-black border-warcrow-gold/30 text-warcrow-text"
                />
              </div>
              <Button 
                onClick={handleTestConfirmationEmail}
                className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                disabled={isTestingConfirmation || !confirmationEmail}
              >
                {isTestingConfirmation ? 'Sending...' : 'Test Authentication Emails'}
              </Button>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-warcrow-muted">
                  <strong>Note:</strong> If your email is already confirmed in Supabase, you will only receive the direct test email.
                </p>
                <p className="text-xs text-warcrow-muted">
                  <strong>Troubleshooting:</strong> If you receive only the direct test email but not the authentication email:
                </p>
                <ol className="text-xs text-warcrow-muted list-decimal pl-5 space-y-1">
                  <li>Go to <a href="https://supabase.com/dashboard/project/odqyoncwqawdzhquxcmh/auth/templates" target="_blank" rel="noopener noreferrer" className="text-warcrow-gold underline">Supabase Auth Templates</a></li>
                  <li>Scroll down to SMTP Settings</li>
                  <li>Toggle "Enable Custom SMTP" OFF</li>
                  <li>Save changes, then toggle it back ON</li>
                  <li>Re-enter your current Resend API key as the password</li>
                  <li>Save changes and test again</li>
                </ol>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Test User Signup</h2>
            <p className="text-sm text-warcrow-muted mb-4 text-center">
              Test if new users can register with Supabase authentication.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="signupEmail" className="block text-sm font-medium text-warcrow-text mb-1">
                  Email Address
                </label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="Enter test email address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full mb-2 bg-black border-warcrow-gold/30 text-warcrow-text"
                />
              </div>
              <div>
                <label htmlFor="signupPassword" className="block text-sm font-medium text-warcrow-text mb-1">
                  Password (min 6 characters)
                </label>
                <Input
                  id="signupPassword"
                  type="password"
                  placeholder="Enter test password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full mb-4 bg-black border-warcrow-gold/30 text-warcrow-text"
                />
              </div>
              <Button 
                onClick={handleTestUserSignup}
                className="w-full border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                disabled={isTestingSignup || !signupEmail || !signupPassword || signupPassword.length < 6}
              >
                {isTestingSignup ? 'Testing Signup...' : 'Test User Signup'}
              </Button>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-warcrow-muted">
                  <strong>Note:</strong> This will attempt to create a real test user in your Supabase project.
                </p>
                <p className="text-xs text-warcrow-muted">
                  <strong>Troubleshooting:</strong> If signup fails but no error is shown, check the Supabase authentication logs.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
            <h2 className="text-lg font-semibold mb-4 text-warcrow-gold">Resend All Pending Confirmation Emails</h2>
            <p className="text-sm text-warcrow-muted mb-4">Resend confirmation emails to all users who haven't confirmed their accounts.</p>
            <Button 
              onClick={handleResendConfirmations}
              className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              disabled={isResendingAll}
            >
              {isResendingAll ? 'Sending...' : 'Resend Confirmations'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mail;
