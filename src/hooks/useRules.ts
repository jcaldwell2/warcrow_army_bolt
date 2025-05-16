
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  title_es?: string | null;
  title_fr?: string | null;
  sections: Section[];
}

export const useRules = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["rules", language],
    queryFn: async () => {
      console.log("Fetching rules for language:", language);
      
      // Fetch chapters data with explicit error handling
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("rules_chapters")
        .select("*")
        .order("order_index");

      if (chaptersError) {
        console.error("Error fetching chapters:", chaptersError);
        throw chaptersError;
      }
      
      console.log("Fetched chapters raw data:", chaptersData);

      // Fetch sections data with explicit error handling
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("rules_sections")
        .select("*")
        .order("order_index");

      if (sectionsError) {
        console.error("Error fetching sections:", sectionsError);
        throw sectionsError;
      }

      // Create typed chapters based on the language selection
      const typedChapters: Chapter[] = chaptersData.map(chapter => {
        // Get title based on selected language
        let title = chapter.title;
        
        // Use Spanish title from database if available and Spanish is selected
        if (language === 'es' && chapter.title_es) {
          title = chapter.title_es;
          console.log("Using Spanish title from database:", title);
        }

        // Use French title from database if available and French is selected
        if (language === 'fr' && chapter.title_fr) {
          title = chapter.title_fr;
          console.log("Using French title from database:", title);
        }

        // Debug chapter data
        console.log(`Chapter data (${language}):`, { 
          id: chapter.id,
          english_title: chapter.title,
          spanish_title: chapter.title_es,
          french_title: chapter.title_fr,
          using_title: title
        });

        // Get sections for this chapter with proper language content
        const chapterSections = sectionsData
          .filter((section) => section.chapter_id === chapter.id)
          .map((section) => {
            let sectionTitle = section.title;
            let sectionContent = section.content;

            // Use Spanish content if available and Spanish is selected
            if (language === 'es') {
              if (section.title_es) {
                sectionTitle = section.title_es;
              }
              if (section.content_es) {
                sectionContent = section.content_es;
              }
            }

            // Use French content if available and French is selected
            if (language === 'fr') {
              if (section.title_fr) {
                sectionTitle = section.title_fr;
              }
              if (section.content_fr) {
                sectionContent = section.content_fr;
              }
            }

            return {
              id: section.id,
              title: sectionTitle,
              content: sectionContent,
            };
          });

        return {
          id: chapter.id,
          title: title,
          title_es: chapter.title_es,
          title_fr: chapter.title_fr,
          sections: chapterSections,
        };
      });

      // Apply special formatting to specific sections
      // Find the basic concepts chapter and line of sight section
      const basicConceptsChapter = typedChapters.find(chapter => 
        chapter.title.toLowerCase().includes("conceptos básicos") || 
        chapter.title.toLowerCase().includes("basic concepts"));
      
      let lineOfSightSection = null;
      if (basicConceptsChapter) {
        lineOfSightSection = basicConceptsChapter.sections.find(section => 
          section.title.toLowerCase().includes("línea de visión") || 
          section.title.toLowerCase().includes("line of sight"));
      }
      
      // If we found the Line of Sight section, update its content with our custom formatted text
      if (lineOfSightSection) {
        if (language === 'en') {
          lineOfSightSection.content = `${lineOfSightSection.content}\n\nWhen calculating LoS, keep in mind that:\n\nA troop always has LOS towards itself and adjacent troops.\n\n[[red]]When calculating the LoS to a unit, the troops that make it up do not block the LoS to other members of the same unit. For example, when tracing LoS over an Orc Hunter unit, those in front do not block the LoS to those behind.[[/red]]`;
        } else {
          lineOfSightSection.content = `${lineOfSightSection.content}\n\nAl calcular la LdV, ten en cuenta que:\n\nUna tropa siempre tiene LdV hacia sí misma y las tropas adyacentes.\n\n[[red]]Al calcular la LdV hacia una unidad, las tropas que la componen no bloquean la LdV a otros miembros de la misma unidad. Por ejemplo, cuando se traza la LdV sobre una unidad de Cazadores Orcos, los que están delante no bloquean la LdV a los que están detrás.[[/red]]`;
        }
      }
      
      // Find the "Activate a unit and move" section and update it
      for (const chapter of typedChapters) {
        const activateAndMoveSection = chapter.sections.find(section => 
          section.title.toLowerCase().includes("activar una unidad") || 
          section.title.toLowerCase().includes("activate a unit and move"));
        
        if (activateAndMoveSection) {
          if (language === 'en') {
            activateAndMoveSection.content = `${activateAndMoveSection.content}\n\n[...] Keep in mind that:\n\n[[red]]Your unit can perform the move action and stand still.[[/red]]`;
          } else {
            activateAndMoveSection.content = `${activateAndMoveSection.content}\n\n[...] Ten en cuenta que:\n\n[[red]]Tu unidad puede realizar la acción de movimiento y permanecer inmóvil.[[/red]]`;
          }
        }
      }

      console.log("Processed chapters for language:", language);
      console.log("First few chapter titles:", typedChapters.slice(0, 3).map(c => c.title));
      
      return typedChapters;
    },
    refetchOnWindowFocus: false,
    staleTime: 0, // Reduced to 0 seconds to ensure fresh data on every query
  });
};
