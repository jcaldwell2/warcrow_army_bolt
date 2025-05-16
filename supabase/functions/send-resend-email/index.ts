
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  type?: 'welcome' | 'reset_password';
  token?: string;
  fromEmail?: string; 
  fromName?: string;  
  checkDomainOnly?: boolean; 
  resendAllPendingConfirmations?: boolean;
  testConfirmationEmail?: boolean;
  email?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Resend email function received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API key first
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured in Supabase");
      return new Response(
        JSON.stringify({ 
          error: "Resend API key is not configured",
          timestamp: new Date().toISOString(),
          details: "Please set the RESEND_API_KEY in Supabase Edge Function settings"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailRequest: EmailRequest = await req.json();
    console.log('Received email request:', {
      to: emailRequest.to,
      subject: emailRequest.subject,
      type: emailRequest.type || 'standard',
      fromEmail: emailRequest.fromEmail,
      fromName: emailRequest.fromName,
      checkDomainOnly: emailRequest.checkDomainOnly,
      resendAllPendingConfirmations: emailRequest.resendAllPendingConfirmations,
      testConfirmationEmail: emailRequest.testConfirmationEmail,
      email: emailRequest.email
    });

    // Check if this is just a domain verification check
    if (emailRequest.checkDomainOnly) {
      console.log('Domain verification check requested');
      
      try {
        // Test the API key by making a simple API call
        try {
          const keyTestResponse = await resend.emails.get('testing-key');
          console.log("API key test response:", keyTestResponse);
        } catch (keyError: any) {
          // If we get a "not found" error, that's actually good - it means the API key is valid
          // but the email ID doesn't exist (which is expected)
          if (keyError.statusCode === 404) {
            console.log("API key is valid (404 error on non-existent email ID is expected)");
          } else if (keyError.statusCode === 400 && keyError.message?.includes("API key is invalid")) {
            console.error("INVALID API KEY DETECTED:", keyError.message);
            return new Response(
              JSON.stringify({ 
                verified: false,
                status: "The Resend API key is invalid. Please update it in Supabase Edge Functions settings.",
                timestamp: new Date().toISOString(),
                domains: [],
                error: { message: keyError.message }
              }),
              {
                status: 200, // We still return 200 since this is an expected error state
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          } else {
            console.error("Unknown API key test error:", keyError);
          }
        }

        // Get all domains in the Resend account
        const domainsResponse = await resend.domains.list();
        
        console.log('Domains in Resend account:', JSON.stringify(domainsResponse));
        
        // Default email domain
        const defaultDomain = "updates.warcrowarmy.com";
        
        // Check if our domain is in the verified list
        const ourDomain = emailRequest.fromEmail ? 
          emailRequest.fromEmail.split('@')[1] : 
          defaultDomain;
          
        // Fix the domain verification check - properly access the domains data
        const verifiedDomains = Array.isArray(domainsResponse.data) ? 
          domainsResponse.data : 
          (domainsResponse.data?.data || []);
        
        const domainRecord = verifiedDomains.find(
          domain => domain.name === ourDomain
        );
        
        const isDomainVerified = domainRecord?.status === 'verified';
        
        console.log(`Domain ${ourDomain} verification status:`, 
          isDomainVerified ? 'Verified' : `Not verified (${domainRecord?.status || 'not found'})`);
        
        return new Response(JSON.stringify({
          verified: isDomainVerified,
          status: domainRecord ? 
            `Domain ${ourDomain} is ${domainRecord.status}` : 
            `Domain ${ourDomain} not found in Resend account`,
          timestamp: new Date().toISOString(),
          domains: verifiedDomains
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (domainError) {
        console.error('Failed to check domain verification status:', domainError);
        
        // Check if the error is related to an invalid API key
        if (domainError.message?.includes('API key is invalid')) {
          return new Response(
            JSON.stringify({ 
              verified: false,
              status: "The Resend API key is invalid. Please update it in Supabase Edge Functions settings.",
              timestamp: new Date().toISOString(),
              domains: [],
              error: { message: domainError.message }
            }),
            {
              status: 200, // We still return 200 since this is an expected error state
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            verified: false,
            status: `Error checking domains: ${domainError.message || 'Unknown error'}`,
            timestamp: new Date().toISOString(),
            domains: []
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Handle specific test for confirmation email
    if (emailRequest.testConfirmationEmail && emailRequest.email) {
      console.log(`Testing confirmation email delivery to: ${emailRequest.email}`);
      
      try {
        // Get the API key from environment
        const apiKey = Deno.env.get("RESEND_API_KEY");
        console.log("RESEND_API_KEY present:", !!apiKey);
        
        if (!apiKey) {
          throw new Error("RESEND_API_KEY is not configured in Supabase");
        }
        
        // Test the API key by making a simple API call
        try {
          const keyTestResponse = await resend.emails.get('testing-key');
          console.log("API key test response:", keyTestResponse);
        } catch (keyError: any) {
          // If we get a "not found" error, that's actually good - it means the API key is valid
          // but the email ID doesn't exist (which is expected)
          if (keyError.statusCode === 404) {
            console.log("API key is valid (404 error on non-existent email ID is expected)");
          } else if (keyError.statusCode === 400 && keyError.message?.includes("API key is invalid")) {
            console.error("INVALID API KEY DETECTED:", keyError.message);
            throw new Error("The Resend API key configured in Supabase is invalid. Please update it in the Supabase dashboard under Settings > Functions.");
          } else {
            console.error("Unknown API key test error:", keyError);
          }
        }
        
        // Add more diagnostic information about the environment
        const diagnosticInfo = {
          apiKeyPresent: !!apiKey,
          apiKeyLength: apiKey ? apiKey.length : 0,
          apiKeyPrefix: apiKey ? apiKey.substring(0, 3) + "..." : "none",
          apiKeyLastUpdated: new Date().toISOString(),
          environment: {
            isDeno: typeof Deno !== 'undefined',
            denoVersion: Deno.version ? Deno.version.deno : 'unknown',
          }
        };
        
        console.log("Diagnostic information:", diagnosticInfo);
        
        // Send a direct test email using Resend to verify basic email functionality
        const testEmailResult = await resend.emails.send({
          from: "Warcrow Army <updates@updates.warcrowarmy.com>",
          to: [emailRequest.email],
          subject: emailRequest.subject || "Email Deliverability Test",
          html: emailRequest.html || `
            <h1>Email Deliverability Test</h1>
            <p>This is a test email to verify that we can send emails to your account using Resend directly.</p>
            <p>If you are seeing this, it means that our system can successfully deliver emails to you.</p>
            <p>Next, please check if you receive a separate Supabase authentication email.</p>
            <p>If you don't receive the Supabase authentication email, please make sure that:</p>
            <ul>
              <li>You've correctly set up Resend as your SMTP provider in Supabase</li>
              <li>Your domain is verified in Resend</li>
              <li>The Supabase auth settings are configured to send confirmation emails</li>
              <li>The Resend API key in your Supabase SMTP settings is current and valid</li>
            </ul>
          `,
        });
        
        console.log("Direct test email result:", testEmailResult);
        
        return new Response(JSON.stringify({
          success: true,
          message: `Test email sent to ${emailRequest.email}. If you're using Resend as Supabase's SMTP provider, you should also receive a Supabase authentication email.`,
          directEmailSent: !!testEmailResult.id,
          timestamp: new Date().toISOString(),
          diagnostics: diagnosticInfo,
          resendApiInfo: {
            present: !!apiKey,
            keyLength: apiKey ? apiKey.length : 0,
            keyPrefix: apiKey ? apiKey.substring(0, 3) + "..." : "none"
          }
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (confirmError) {
        console.error('Error in test confirmation email:', {
          error: confirmError,
          message: confirmError.message,
          stack: confirmError.stack
        });
        
        // Check if the error is related to an invalid API key
        if (confirmError.message?.includes('API key is invalid')) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: "The Resend API key is invalid. Please update it in Supabase Edge Functions settings.",
              timestamp: new Date().toISOString()
            }),
            {
              status: 200, // We still return 200 since this is an expected error state
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: confirmError.message || 'Unknown error',
            timestamp: new Date().toISOString()
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Improved error handling and logging
    if (!emailRequest.to || !Array.isArray(emailRequest.to) || emailRequest.to.length === 0) {
      console.error('Invalid recipient list:', emailRequest.to);
      return new Response(
        JSON.stringify({ error: 'Invalid recipient list' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the API key from environment
    const apiKey = Deno.env.get("RESEND_API_KEY");
    // For security, we only log a portion of the API key for debugging
    const maskedApiKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null;
    
    // Use custom from email if provided, otherwise use default
    const fromEmail = emailRequest.fromEmail || "updates@updates.warcrowarmy.com";
    const fromName = emailRequest.fromName || "Warcrow Army";
    const fromField = `${fromName} <${fromEmail}>`;

    // Log the full configuration being used
    console.log('Sending email with configuration:', {
      from: fromField,
      to: emailRequest.to,
      subject: emailRequest.subject,
      htmlLength: emailRequest.html?.length || 0,
      apiKeyPresent: !!apiKey,
      apiKeyMasked: maskedApiKey,
      domainUsed: fromEmail.split('@')[1]
    });

    // Fetch verified domains to check if our domain is actually verified
    try {
      const domainsResponse = await resend.domains.list();
      console.log('Verified domains in Resend account:', JSON.stringify(domainsResponse));
      
      // Fix this check to properly access domain data
      const ourDomain = fromEmail.split('@')[1];
      const verifiedDomains = Array.isArray(domainsResponse.data) ? 
        domainsResponse.data : 
        (domainsResponse.data?.data || []);
        
      const isDomainVerified = verifiedDomains.some(
        domain => domain.name === ourDomain && domain.status === 'verified'
      );
      
      console.log(`Domain ${ourDomain} verification status:`, isDomainVerified ? 'Verified' : 'Not verified');
      
      if (!isDomainVerified) {
        console.warn(`Warning: The domain ${ourDomain} appears to not be verified in this Resend account.`);
      }
    } catch (domainError) {
      console.error('Failed to check domain verification status:', domainError);
      
      // Check if the error is related to an invalid API key
      if (domainError.message?.includes('API key is invalid')) {
        return new Response(
          JSON.stringify({ 
            error: "The Resend API key is invalid. Please update it in Supabase Edge Functions settings.",
            timestamp: new Date().toISOString()
          }),
          {
            status: 200, // We still return 200 since this is an expected error state
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const emailResponse = await resend.emails.send({
      from: fromField,
      to: emailRequest.to,
      subject: emailRequest.subject,
      html: emailRequest.html,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error('Error in send-resend-email function:', {
      error,
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response data'
    });

    let errorMessage = error.message || 'Unknown error';
    let errorDetails = 'No additional details available';
    
    if (error.response?.data) {
      errorDetails = typeof error.response.data === 'string' 
        ? error.response.data 
        : JSON.stringify(error.response.data);
    }
    
    // Check if the error is related to an invalid API key
    if (error.message?.includes('API key is invalid')) {
      return new Response(
        JSON.stringify({ 
          error: "The Resend API key is invalid. Please update it in Supabase Edge Functions settings.",
          timestamp: new Date().toISOString()
        }),
        {
          status: 200, // We still return 200 since this is an expected error state so frontend can handle it better
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
