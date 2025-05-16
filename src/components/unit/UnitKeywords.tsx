
import { Keyword } from "@/types/army";
import KeywordsSection from "./keyword-sections/KeywordsSection";
import SpecialRulesSection from "./keyword-sections/SpecialRulesSection";

interface UnitKeywordsProps {
  keywords: Keyword[] | string[];
  specialRules?: string[];
}

const UnitKeywords = ({ keywords, specialRules }: UnitKeywordsProps) => {
  // Convert string[] to Keyword[] if needed
  const processedKeywords: Keyword[] = keywords.map(keyword => {
    if (typeof keyword === 'string') {
      return { 
        name: keyword, 
        description: "" 
      };
    }
    return keyword;
  });

  return (
    <div className="space-y-2">
      <KeywordsSection keywords={processedKeywords} />
      <SpecialRulesSection specialRules={specialRules} />
    </div>
  );
};

export default UnitKeywords;
