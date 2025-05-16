
import { supabase } from "@/integrations/supabase/client";
import { DomainVerificationResult } from "./types";

export const checkDomainVerificationStatus = async (): Promise<DomainVerificationResult> => {
  try {
    console.log('Checking domain verification status...');
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        checkDomainOnly: true,
        to: ['check@example.com'],
        subject: 'Domain Check',
        html: '<p>Domain verification check</p>'
      }
    });

    if (error) {
      console.error('Error checking domain status:', error);
      return {
        verified: false,
        status: `Error: ${error.message}`,
        domains: []
      };
    }

    console.log('Domain status check result:', data);
    return data;
  } catch (error) {
    console.error('Failed to check domain status:', error);
    return {
      verified: false,
      status: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
      domains: []
    };
  }
};
