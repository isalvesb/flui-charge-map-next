import type { ComponentType, ReactNode, RefObject } from "react";
import type { TextInput } from "react-native";

import type { ChargingStation, StationFilters } from "../../../types";
import type { QuickFilterId, QuickFilters } from "./Search.utils";

export type SearchFilterChip = {
  id: QuickFilterId;
  label: string;
  icon: ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
};

export type SearchSectionProps = {
  children: ReactNode;
};

export type SearchFiltersButtonProps = {
  onPress: () => void;
};

export type SearchFiltersProps = {
  filters: SearchFilterChip[];
};

export type UseSearchParams = {
  filters: StationFilters;
  stations: ChargingStation[];
  now: Date;
  query: string;
};

export type SearchState = {
  query: string;
  quickFilters: QuickFilters;
  filters: StationFilters;
  hasQuery: boolean;
  hasFilters: boolean;
  results: { station: ChargingStation; index: number }[];
};

export type SearchActions = {
  setQuery: (query: string) => void;
  toggleQuickFilter: (id: QuickFilterId) => void;
};

export type SearchMeta = {
  inputRef: RefObject<TextInput | null>;
};

export type SearchValue = {
  state: SearchState;
  actions: SearchActions;
  meta: SearchMeta;
};
