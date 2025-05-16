import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const updatePasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
  confirmPassword: z.string()
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = React.useState<boolean>(true);
  const [rateLimited, setRateLimited] = React.useState(false);
  const [retryAfter, setRetryAfter] = React.useState(0);

  React.useEffect(() => {
    const getEmailFromHash = async () => {
      try {
        const hashFragment = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashFragment);
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        const refreshToken = hashParams.get('refresh_token');

        console.log('Reset password flow:', {
          hasAccessToken: !!accessToken,
          type,
          hasRefreshToken: !!refreshToken
        });
        
        if (!accessToken || type !== 'recovery') {
          setError("Invalid or expired reset link. Please request a new password reset.");
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          if (sessionError.message?.includes('rate_limit')) {
            handleRateLimitError(sessionError.message);
            return;
          }
          setError("Unable to verify your identity. Please request a new password reset.");
          return;
        }

        if (!session?.user?.email) {
          console.error('No user email in session');
          setError("Unable to verify your identity. Please request a new password reset.");
          return;
        }

        console.log('Session established for:', session.user.email);
        setUserEmail(session.user.email);

      } catch (err: any) {
        console.error('Error processing reset token:', err);
        if (err.message?.includes('rate_limit')) {
          handleRateLimitError(err.message);
          return;
        }
        setError("An error occurred while processing your reset link.");
      }
    };

    getEmailFromHash();
  }, []);

  const handleRateLimitError = (errorMessage: string) => {
    const waitTime = errorMessage.match(/\d+/)?.[0] || '60';
    setRateLimited(true);
    setRetryAfter(parseInt(waitTime));
    setError(`Too many attempts. Please wait ${waitTime} seconds before trying again.`);
    
    // Start countdown
    const timer = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRateLimited(false);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updatePasswordForm = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch both password fields for real-time comparison
  const password = updatePasswordForm.watch("password");
  const confirmPassword = updatePasswordForm.watch("confirmPassword");

  React.useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  const onUpdatePassword = async (data: UpdatePasswordFormData) => {
    if (rateLimited) {
      toast.error(`Please wait ${retryAfter} seconds before trying again.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Attempting password update for:', userEmail);

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        if (updateError.message?.includes('rate_limit')) {
          handleRateLimitError(updateError.message);
          return;
        }
        throw updateError;
      }

      console.log('Password updated successfully');
      
      // Sign out the user to clear any existing sessions
      await supabase.auth.signOut();

      toast.success("Password has been successfully updated. Please log in with your new password.", {
        duration: 5000,
      });

      // Clear form and hash parameters
      updatePasswordForm.reset();
      window.location.hash = '';
      
      // Redirect to login with a success message parameter
      setTimeout(() => {
        navigate("/login?message=password_reset");
      }, 2000);

    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err.message || "An error occurred while updating your password");
    } finally {
      setLoading(false);
    }
  };

  // ... keep existing code (JSX for the form)

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-warcrow-accent rounded-lg shadow-lg">
        <img 
          src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
          alt="Warcrow Logo" 
          className="h-24 mx-auto mb-8"
        />
        <h2 className="text-2xl font-bold text-center mb-6 text-warcrow-gold">
          Set New Password
        </h2>
        
        {userEmail && (
          <Alert className="mb-6 border-warcrow-gold bg-warcrow-gold/10">
            <AlertDescription className="text-warcrow-gold">
              Changing password for: {userEmail}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              {rateLimited && retryAfter > 0 && (
                <span className="block mt-1">
                  Time remaining: {retryAfter} seconds
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Form {...updatePasswordForm}>
          <form onSubmit={updatePasswordForm.handleSubmit(onUpdatePassword)} className="space-y-6">
            <FormField
              control={updatePasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-warcrow-gold">New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      className="bg-warcrow-background border-warcrow-gold text-warcrow-text placeholder:text-warcrow-muted"
                      disabled={rateLimited}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={updatePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-warcrow-gold">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      className={`bg-warcrow-background border-warcrow-gold text-warcrow-text placeholder:text-warcrow-muted ${
                        confirmPassword && !passwordMatch ? 'border-red-500' : ''
                      }`}
                      disabled={rateLimited}
                      {...field}
                    />
                  </FormControl>
                  {confirmPassword && !passwordMatch && (
                    <p className="text-sm text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
                disabled={loading || !userEmail || !passwordMatch || rateLimited}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
