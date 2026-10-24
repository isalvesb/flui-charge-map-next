import { createContext, use, type ReactNode } from "react";

import type { SearchValue } from "../features/map/search/Search.types";

const SearchContext = createContext<SearchValue | null>(null);

export function SearchProvider({
  value,
  children,
}: {
  value: SearchValue;
  children: ReactNode;
}) {
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const value = use(SearchContext);

  if (!value) {
    throw new Error("Search.Provider is required");
  }

  return value;
}
