
import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  caseSensitive: boolean;
  setCaseSensitive: (value: boolean) => void;
  searchResults: number;
  setSearchResults: (count: number) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [searchResults, setSearchResults] = useState(0);

  return (
    <SearchContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      caseSensitive, 
      setCaseSensitive,
      searchResults,
      setSearchResults
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
