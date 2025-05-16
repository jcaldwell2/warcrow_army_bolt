
// Update the send email utility to fix the type errors
import { supabase } from "@/integrations/supabase/client";
import { EmailOptions } from "./types";

export const sendEmail = async (
  to: string[],
  subject: string,
  html: string,
  options?: EmailOptions
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        to,
        subject,
        html,
        fromEmail: options?.fromEmail,
        fromName: options?.fromName,
        replyTo: options?.replyTo
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    throw error;
  }
};
