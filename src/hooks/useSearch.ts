import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TextInput } from "react-native";

import { filtrarEstacoes } from "../utils/filtrarEstacoes";
import {
  applyQuickFilters,
  hasActiveQuickFilters,
  hasActiveStationFilters,
  initialQuickFilters,
  rankStationsByQuickFilters,
  type QuickFilterId,
  type QuickFilters,
} from "../features/map/search/Search.utils";
import type {
  SearchValue,
  UseSearchParams,
} from "../features/map/search/Search.types";

export function useSearch({
  filters,
  stations,
  now,
  query: routeQuery,
}: UseSearchParams): SearchValue {
  const [query, setQuery] = useState(routeQuery);
  const [quickFilters, setQuickFilters] =
    useState<QuickFilters>(initialQuickFilters);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setQuery(routeQuery);
  }, [routeQuery]);

  const effectiveFilters = useMemo(() => {
    return applyQuickFilters(filters, quickFilters);
  }, [filters, quickFilters]);

  const results = useMemo(() => {
    const filtradas = filtrarEstacoes({
      estacoes: stations,
      filtros: effectiveFilters,
      termoBusca: query,
      agora: now,
    });

    return rankStationsByQuickFilters(
      filtradas.map((station) => ({
        station,
        index: stations.indexOf(station),
      })),
      quickFilters,
    );
  }, [effectiveFilters, now, query, quickFilters, stations]);

  const toggleQuickFilter = useCallback((id: QuickFilterId) => {
    setQuickFilters((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }, []);

  return {
    state: {
      query,
      quickFilters,
      filters: effectiveFilters,
      hasQuery: query.trim().length > 0,
      hasFilters:
        hasActiveStationFilters(effectiveFilters) ||
        hasActiveQuickFilters(quickFilters),
      results,
    },
    actions: {
      setQuery,
      toggleQuickFilter,
    },
    meta: {
      inputRef,
    },
  };
}
