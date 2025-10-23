import { useState, useContext, createContext, useEffect } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // ✅ initial state localStorage se load karo
  const [search, setSearch] = useState(() => {
    const localData = localStorage.getItem("search");
    return localData ? JSON.parse(localData) : { keyword: "", result: [] };
  });

  // ✅ jab bhi search state update ho, localStorage me save karo
  useEffect(() => {
    localStorage.setItem("search", JSON.stringify(search));
  }, [search]);

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
