import { ScrollView, Text, TextInput, View } from "react-native";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react-native";

import { PressableScale } from "../../../components";
import { SearchProvider, useSearchContext } from "../../../context/SearchContext";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import type {
  SearchFiltersButtonProps,
  SearchFiltersProps,
  SearchSectionProps,
} from "./Search.types";
import baseStyles, { colors as baseColors } from "./Search.styles";

function SearchBar({ children }: SearchSectionProps) {
  const { styles } = useTelaComPreferencias(baseStyles, baseColors);

  return <View style={styles.searchBar}>{children}</View>;
}

function SearchField() {
  const { styles, colors } = useTelaComPreferencias(baseStyles, baseColors);
  const {
    state: { query },
    actions: { setQuery },
    meta: { inputRef },
  } = useSearchContext();

  return (
    <>
      <SearchIcon size={21} color={colors.textMuted} strokeWidth={2} />
      <TextInput
        ref={inputRef}
        accessibilityLabel="Buscar no mapa"
        accessibilityHint="Digite endereço, bairro ou nome do ponto de recarga."
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar endereço, bairro ou ponto"
        placeholderTextColor={colors.textMuted}
        style={styles.searchText}
        returnKeyType="search"
      />
    </>
  );
}

function SearchFiltersButton({ onPress }: SearchFiltersButtonProps) {
  const { styles, colors } = useTelaComPreferencias(baseStyles, baseColors);

  return (
    <>
      <View style={styles.searchDivider} />
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Abrir busca e filtros"
        style={styles.filterButton}
        onPress={onPress}
      >
        <SlidersHorizontal
          size={21}
          color={colors.primary}
          strokeWidth={2}
        />
      </PressableScale>
    </>
  );
}

function SearchFilters({ filters }: SearchFiltersProps) {
  const { styles, colors } = useTelaComPreferencias(baseStyles, baseColors);
  const {
    state: { quickFilters },
    actions: { toggleQuickFilter },
  } = useSearchContext();

  return (
    <View style={styles.quickFiltersArea}>
      <ScrollView
        horizontal
        tabIndex={-1}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => {
          const Icon = filter.icon;
          const active = quickFilters[filter.id];

          return (
            <PressableScale
              key={filter.id}
              accessibilityRole="button"
              accessibilityLabel={filter.label}
              accessibilityHint="Filtra os pontos do catálogo demonstrativo."
              accessibilityState={{ selected: active }}
              pressedScale={0.96}
              style={[styles.chip, active ? styles.chipActive : null]}
              onPress={() => toggleQuickFilter(filter.id)}
            >
              <Icon
                size={17}
                color={active ? colors.white : colors.primary}
                strokeWidth={2}
              />
              <Text
                style={[styles.chipText, active ? styles.chipTextActive : null]}
              >
                {filter.label}
              </Text>
            </PressableScale>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const Search = {
  Provider: SearchProvider,
  Bar: SearchBar,
  Field: SearchField,
  FiltersButton: SearchFiltersButton,
  Filters: SearchFilters,
};
