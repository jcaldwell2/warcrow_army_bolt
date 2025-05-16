
export interface EmailOptions {
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

export interface ResendConfirmationResult {
  success: boolean;
  message: string;
  details: any;
}

export interface DomainVerificationResult {
  verified: boolean;
  status: string;
  domains: Array<{
    id: string;
    name: string;
    status: string;
    created_at?: string;
    region?: string;
  }>;
}

export interface AdminUpdateResult {
  success: boolean;
  message: string;
}

export interface WabAdmin {
  id: string;
  username: string | null;
  wab_id: string | null;
  email: string;
}

export interface UserProfile {
  id: string;
  username: string | null;
  wab_id: string | null;
  avatar_url: string | null;
  banned?: boolean;
  deactivated?: boolean;
}

// Define types for Supabase admin responses
export interface SupabaseUserMetadata {
  email_confirmed_at?: string;
  [key: string]: any;
}

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: SupabaseUserMetadata;
  [key: string]: any;
}

export interface SupabaseAdminUsersResponse {
  users?: SupabaseUser[];
  [key: string]: any;
}

// Re-export everything from the email functions for consistency
export { testConfirmationEmail, resendAllPendingConfirmationEmails } from './confirmationEmails';
export { testResendEmail } from './testEmail';
export { checkDomainVerificationStatus } from './domainVerification';
export { testUserSignup } from './confirmationEmails';
