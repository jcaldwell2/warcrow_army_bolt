
import { supabase } from "../integrations/supabase/client";
import { FAQSection } from "@/utils/types/faqTypes";

export type { FAQSection };

export const fetchFAQSections = async (language: string = 'en'): Promise<FAQSection[]> => {
  try {
    const { data, error } = await supabase
      .from('faq_sections')
      .select('*')
      .order('order_index');
      
    if (error) {
      throw error;
    }
    
    // Log data for debugging
    console.log(`Fetched ${data?.length || 0} FAQ sections for language: ${language}`);
    
    return data || [];
  } catch (error) {
    console.error('Error fetching FAQ sections:', error);
    throw error;
  }
};
