
import { sendEmail } from './sendEmail';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Types of alerts that can be sent to administrators
 */
export enum AdminAlertType {
  ERROR = 'error',
  DOWNTIME = 'downtime',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Interface for alert data
 */
export interface AdminAlertData {
  title: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: Date;
  type: AdminAlertType;
  source?: string;
}

/**
 * Result of sending an admin alert
 */
export interface AdminAlertResult {
  success: boolean;
  message: string;
  error?: any;
}

/**
 * Sends an alert to all WAB administrators
 * @param alertData Alert data to send
 * @returns Result of the alert operation
 */
export async function sendAdminAlert(alertData: AdminAlertData): Promise<AdminAlertResult> {
  try {
    // Set timestamp if not provided
    const timestamp = alertData.timestamp || new Date();
    
    // Get all admin users
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id, wab_admin')
      .eq('wab_admin', true);
    
    if (adminsError) {
      console.error('Error fetching admin users:', adminsError);
      return {
        success: false,
        message: 'Failed to fetch admin users',
        error: adminsError
      };
    }

    if (!admins || admins.length === 0) {
      console.warn('No admin users found to send alert to');
      return {
        success: false,
        message: 'No admin users found to send alert to'
      };
    }

    // Get emails of admin users
    const adminEmails: string[] = [];
    
    for (const admin of admins) {
      // Fetch email from auth.users via RPC since it's not stored in profiles
      try {
        const { data: emailData, error: emailError } = await supabase.rpc(
          'get_user_email',
          { user_id: admin.id }
        );
        
        if (emailError) {
          console.error(`Error fetching email for admin ${admin.id}:`, emailError);
          continue;
        }
        
        if (emailData && emailData.length > 0 && emailData[0].email) {
          // Extract the email string from the data object
          adminEmails.push(emailData[0].email);
        } else {
          console.warn(`No email found for admin ${admin.id}`);
        }
      } catch (err) {
        console.error(`Failed to get email for admin ${admin.id}:`, err);
      }
    }
    
    if (adminEmails.length === 0) {
      console.error('Could not find any admin email addresses');
      return {
        success: false,
        message: 'Could not find any admin email addresses'
      };
    }

    // Generate alert HTML
    const alertHtml = generateAlertEmail(alertData);
    
    // Send email to all admin users
    const emailSubject = `[${alertData.type.toUpperCase()}] ${alertData.title}`;
    
    await sendEmail(
      adminEmails,
      emailSubject,
      alertHtml,
      {
        fromName: 'Warcrow Army System',
        fromEmail: 'alerts@updates.warcrowarmy.com',
        replyTo: 'no-reply@updates.warcrowarmy.com'
      }
    );

    console.log(`Admin alert sent to ${adminEmails.length} administrators`);
    return {
      success: true,
      message: `Alert sent to ${adminEmails.length} administrators`
    };
  } catch (error) {
    console.error('Error sending admin alert:', error);
    return {
      success: false,
      message: 'Failed to send admin alert',
      error
    };
  }
}

/**
 * Generate HTML email content for an admin alert
 * @param alertData The alert data
 * @returns HTML string for the email
 */
function generateAlertEmail(alertData: AdminAlertData): string {
  const { title, message, details, timestamp, type, source } = alertData;
  const formattedTimestamp = timestamp ? timestamp.toISOString() : new Date().toISOString();
  const sourceName = source || 'Warcrow Army Builder';
  
  // Set color based on alert type
  let alertColor = '#1E88E5'; // default blue for info
  
  switch (type) {
    case AdminAlertType.ERROR:
      alertColor = '#E53935'; // red
      break;
    case AdminAlertType.DOWNTIME:
      alertColor = '#6A1B9A'; // purple
      break;
    case AdminAlertType.WARNING:
      alertColor = '#FB8C00'; // orange
      break;
  }
  
  // Format details if present
  let detailsHtml = '';
  if (details && Object.keys(details).length > 0) {
    detailsHtml = `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; border-left: 4px solid ${alertColor};">
        <h3 style="margin-top: 0; color: #333;">Additional Details:</h3>
        <pre style="white-space: pre-wrap; overflow-wrap: break-word; font-family: monospace; background-color: #f0f0f0; padding: 10px; border-radius: 4px;">${JSON.stringify(details, null, 2)}</pre>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #333; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${alertColor}; padding: 20px; color: white; border-top-left-radius: 5px; border-top-right-radius: 5px;">
          <h1 style="margin: 0; font-size: 24px;">${title}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">
            ${type.toUpperCase()} ALERT from ${sourceName}
          </p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="margin-top: 0; font-size: 16px; line-height: 1.5;">
            ${message}
          </p>
          
          ${detailsHtml}
          
          <p style="margin-top: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 15px;">
            Timestamp: ${formattedTimestamp}<br>
            This is an automated alert from the Warcrow Army System.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Utility to test admin alerts by sending a test alert to all admins
 */
export async function sendTestAdminAlert(): Promise<AdminAlertResult> {
  try {
    const result = await sendAdminAlert({
      title: 'Test Admin Alert',
      message: 'This is a test alert to verify the admin notification system is working correctly.',
      type: AdminAlertType.INFO,
      details: {
        test: true,
        generatedAt: new Date().toISOString()
      }
    });
    
    if (result.success) {
      toast.success('Test admin alert sent successfully');
    } else {
      toast.error(`Failed to send test alert: ${result.message}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error sending test admin alert:', error);
    toast.error('Failed to send test admin alert');
    
    return {
      success: false,
      message: 'Failed to send test admin alert',
      error
    };
  }
}

/**
 * Send an error alert for unexpected application errors
 * @param error The error object
 * @param context Additional context about where the error occurred
 */
export async function sendErrorAlert(error: Error, context?: string): Promise<AdminAlertResult> {
  const errorDetails: Record<string, any> = {
    errorName: error.name,
    errorMessage: error.message,
    stackTrace: error.stack,
    context: context || 'Not specified'
  };
  
  // Add browser information if running in browser
  if (typeof window !== 'undefined') {
    errorDetails.browserInfo = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }
  
  return sendAdminAlert({
    title: `Application Error: ${error.name}`,
    message: `An unexpected error occurred in the application. ${context ? `Context: ${context}` : ''}`,
    type: AdminAlertType.ERROR,
    details: errorDetails
  });
}
