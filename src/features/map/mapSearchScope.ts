import type { StationFilters } from "../../types";

// O raio inicial é útil para explorar perto da origem. Uma busca textual sem
// filtro explícito procura no catálogo inteiro; não altera preferências salvas.
export function getMapSearchScope(filters: StationFilters, search: string, hasExplicitFilters: boolean) {
  return search.trim() && !hasExplicitFilters
    ? { ...filters, distance: { maxKm: Infinity } }
    : filters;
}
