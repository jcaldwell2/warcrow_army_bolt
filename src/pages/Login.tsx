
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";

interface LoginProps {
  onGuestAccess?: () => void;
}

// Define the possible auth event types that include SIGNED_UP
type AuthEventType = 
  | "INITIAL_SESSION" 
  | "SIGNED_IN" 
  | "SIGNED_OUT" 
  | "TOKEN_REFRESHED" 
  | "USER_UPDATED" 
  | "PASSWORD_RECOVERY"
  | "SIGNED_UP"  // Add SIGNED_UP as a valid event type
  | "MFA_CHALLENGE_VERIFIED";

const Login = ({ onGuestAccess }: LoginProps) => {
  const navigate = useNavigate();
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showHomeGuestDialog, setShowHomeGuestDialog] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { resendConfirmationEmail, setIsGuest } = useAuth();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event triggered:', {
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        eventType: event,
        emailConfirmed: session?.user?.email_confirmed_at ? 'Yes' : 'No',
        userMetadata: session?.user?.user_metadata,
        appMetadata: session?.user?.app_metadata
      });
      
      setIsLoading(true);
      
      try {
        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        } else if (event === 'SIGNED_IN') {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('wab_id')
            .eq('id', session?.user?.id)
            .maybeSingle();
          
          console.log('Profile check on sign in:', { 
            profileData, 
            hasWabId: !!profileData?.wab_id, 
            profileError: profileError?.message
          });
          
          toast.success('Successfully signed in!');
          navigate('/');
        } else if (event === 'SIGNED_UP' as AuthEventType) { // Cast to our custom type to fix type error
          console.log('User signed up, checking profile creation...');
          
          if (session?.user?.id) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('wab_id')
              .eq('id', session.user.id)
              .maybeSingle();
              
            console.log('Profile after signup:', { 
              profile, 
              hasWabId: !!profile?.wab_id, 
              error: profileError?.message 
            });
            
            if (!profile?.wab_id) {
              console.warn('Profile created but WAB ID is missing - trigger may not be working');
            }
          }
        } else if (event === 'USER_UPDATED') {
          if (!session?.user?.email_confirmed_at) {
            toast.info('Please check your email to verify your account before signing in');
          } else {
            toast.success('Account created successfully!');
            navigate('/');
          }
        } else if (event === 'SIGNED_OUT') {
          setError(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, checking session validity...');
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (currentSession) {
            toast.success('Successfully signed in!');
            navigate('/');
          }
        }

        const authError = session as unknown as { error?: AuthError };
        if (authError?.error) {
          console.error('Authentication error:', {
            message: authError.error.message,
            status: authError.error.status
          });

          if (authError.error instanceof AuthApiError) {
            switch (authError.error.message) {
              case 'Invalid login credentials':
                setError('Invalid email or password. Please check your credentials and try again.');
                break;
              case 'Email not confirmed':
                setError('Please verify your email address before signing in. Click "Resend Confirmation Email" below.');
                break;
              case 'Too many requests':
                setError('Too many login attempts. Please try again later.');
                break;
              case 'User not found':
                setError('No account found with this email. Please sign up first.');
                break;
              default:
                if (authError.error.message?.includes('rate_limit')) {
                  const waitTime = authError.error.message.match(/\d+/)?.[0] || '60';
                  setError(`Too many attempts. Please wait ${waitTime} seconds before trying again.`);
                  setTimeout(() => setError(null), parseInt(waitTime) * 1000);
                } else {
                  setError(authError.error.message);
                  toast.error('Login failed. Please try again.');
                  setTimeout(() => setError(null), 5000);
                }
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message === 'password_reset') {
      toast.success('Password has been reset successfully. Please sign in with your new password.');
    }

    return () => subscription.unsubscribe();
  }, [navigate, resendConfirmationEmail]);

  // Create enhanced Auth UI components with custom handling
  const customAuthComponents = {
    EmailAuth: (props: any) => {
      const originalOnSubmit = props.onSubmit;
      
      const enhancedOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const view = props.authView || 'sign_in';
        
        if (view === 'sign_up') {
          console.log('Sign up attempt for:', { email, viewType: view });
          
          try {
            await originalOnSubmit(event);
            
            setTimeout(async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                
                console.log('Profile check after signup:', { 
                  hasProfile: !!profile, 
                  wabId: profile?.wab_id,
                  username: profile?.username
                });
              }
            }, 2000);
          } catch (error) {
            console.error('Sign up error:', error);
          }
        } else {
          await originalOnSubmit(event);
        }
      };
      
      // Use proper React import and cloneElement
      return props.children ? {...props.children, props: { ...props.children.props, onSubmit: enhancedOnSubmit }} : null;
    }
  };
  
  const handleGuestAccess = () => {
    setShowGuestDialog(true);
  };

  const handleHomeClick = () => {
    setShowHomeGuestDialog(true);
  };

  const handleResendEmail = () => {
    setShowResendDialog(true);
  };

  const handleResendConfirmation = async () => {
    if (!resendEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await resendConfirmationEmail(resendEmail);
      setShowResendDialog(false);
      setResendEmail('');
    } catch (error) {
      console.error('Failed to resend confirmation:', error);
    } finally {
      setIsResending(false);
    }
  };

  const confirmGuestAccess = () => {
    // Set guest mode in the auth context
    setIsGuest(true);
    
    // Close dialogs
    setShowGuestDialog(false);
    setShowHomeGuestDialog(false);
    
    // Call the onGuestAccess callback if provided
    if (onGuestAccess) {
      onGuestAccess();
    }
    
    // Navigate to the home page
    navigate('/');
  };

  // Return the JSX for the component
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden">
      <div className="w-full max-w-md p-8 bg-warcrow-accent rounded-lg shadow-lg">
        <img 
          src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
          alt="Warcrow Logo" 
          className="h-24 mx-auto mb-8"
        />
        <Alert className="mb-6 border-yellow-600 bg-yellow-900/20">
          <AlertDescription className="text-yellow-200 text-sm">
            - 4/29/2025 Hey everyone! We took a quick break but working on Play Mode, fixing bugs, general optimization. Updates soon! 
          </AlertDescription>
        </Alert>
        <div className="mb-6 flex justify-center gap-4">
          <Button
            onClick={handleHomeClick}
            className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold transition-all duration-300"
          >
            Back to Home
          </Button>
          <Button
            onClick={handleGuestAccess}
            className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold transition-all duration-300"
            disabled={isLoading}
          >
            Continue as Guest
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
            {error.includes('verify your email') && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold transition-all duration-300"
                onClick={handleResendEmail}
              >
                Resend Confirmation Email
              </Button>
            )}
          </Alert>
        )}
        {isLoading && (
          <Alert className="mb-4 border-warcrow-gold bg-warcrow-gold/10">
            <AlertDescription>Signing you in...</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ffd700',
                  brandAccent: '#2a2d34',
                  brandButtonText: "black",
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '6px',
                },
              }
            },
            className: {
              button: 'bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold border border-warcrow-gold text-warcrow-background transition-all duration-300',
              input: 'bg-warcrow-background border-warcrow-gold text-warcrow-text',
              label: 'text-warcrow-text',
              anchor: 'text-warcrow-gold hover:text-warcrow-gold/80',
            },
          }}
          providers={[]}
          // @ts-ignore - Auth UI React doesn't expose the components prop in types, but it works
          components={customAuthComponents}
        />
        <div className="mt-4 text-center">
          <Button 
            variant="link" 
            className="text-warcrow-gold hover:text-warcrow-gold/80"
            onClick={handleResendEmail}
          >
            Didn't receive confirmation email?
          </Button>
        </div>
      </div>

      <AlertDialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-text">Guest Access</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              While using the app as a guest, some features like saving army lists and cloud synchronization will be disabled. Sign in to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmGuestAccess()}
              className="bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold text-warcrow-background border border-warcrow-gold"
            >
              Continue as Guest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showHomeGuestDialog} onOpenChange={setShowHomeGuestDialog}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-text">Continuing as Guest</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              You'll be continuing to the home page as a guest user. Some features will be limited. You can sign in anytime to access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmGuestAccess}
              className="bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold text-warcrow-background border border-warcrow-gold"
            >
              Continue to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-text">Resend Confirmation Email</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              Enter your email address to receive a new confirmation email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input 
              type="email" 
              placeholder="Your email address" 
              value={resendEmail} 
              onChange={(e) => setResendEmail(e.target.value)}
              className="bg-warcrow-background border-warcrow-gold text-warcrow-text"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-warcrow-accent hover:bg-warcrow-gold hover:text-warcrow-background border border-warcrow-gold text-warcrow-gold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResendConfirmation}
              className="bg-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold text-warcrow-background border border-warcrow-gold"
              disabled={isResending || !resendEmail}
            >
              {isResending ? 'Sending...' : 'Send Confirmation Email'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
