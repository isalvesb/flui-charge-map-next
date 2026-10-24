import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";

import { MapProvider } from "../../../context/MapContext";
import { useAppPreferences } from "../../../context/PreferencesContext";
import { SearchProvider } from "../../../context/SearchContext";
import { useCurrentTime } from "../../../hooks/useCurrentTime";
import { useSearch } from "../../../hooks/useSearch";
import {
  getRouteParamString,
  parseStationFiltersParam,
} from "../../../utils/stationFilterParams";
import { canChargeAt } from "../../../utils/stationAvailability";
import {
  FEEDBACK_DURATION,
  MAX_CONTENT_WIDTH,
  TABLET_BREAKPOINT,
} from "../HomeMapScreen.constants";

export function MapSessionProvider({ children }: { children: ReactNode }) {
  const { userPreferences, demoOrigin, demoStations } = useAppPreferences();
  const batteryPercent = userPreferences.batteryPercent;
  const vehicleRangeKm = userPreferences.vehicleRangeKm;
  const now = useCurrentTime();
  const { width } = useWindowDimensions();
  const routeParams = useLocalSearchParams();
  const [isOpeningDetails, setIsOpeningDetails] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const routeSearchTerm = useMemo(() => {
    return getRouteParamString(routeParams.query);
  }, [routeParams.query]);

  const appliedFilters = useMemo(() => {
    return parseStationFiltersParam(routeParams.filters);
  }, [routeParams.filters]);

  const search = useSearch({
    filters: appliedFilters,
    stations: demoStations,
    now,
    query: routeSearchTerm,
  });
  const {
    state: {
      query: searchTerm,
      filters,
      hasQuery: hasSearch,
      hasFilters,
      results: visibleStations,
    },
  } = search;

  const recommendedStations = useMemo(() => {
    return visibleStations.filter((item) => canChargeAt(item.station, now));
  }, [now, visibleStations]);

  const horizontalInset =
    width >= TABLET_BREAKPOINT
      ? Math.max(16, (width - MAX_CONTENT_WIDTH) / 2)
      : 16;

  const openStation = useCallback(
    (stationId: string, startRoute = false) => {
      if (isOpeningDetails) {
        return;
      }

      const route = {
        pathname: "/point-details",
        params: { stationId, ...(startRoute ? { startRoute: "1" } : {}) },
      } as Href;

      setIsOpeningDetails(true);

      setTimeout(() => {
        setIsOpeningDetails(false);
        router.push(route);
      }, 280);
    },
    [isOpeningDetails],
  );

  const adjustSearch = useCallback(() => {
    router.push("/search" as Href);
  }, []);

  const planTrip = useCallback(() => {
    router.push("/trip-planner" as Href);
  }, []);

  const onRecentered = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setFeedbackMessage(
      `Origem demonstrativa centralizada: ${demoOrigin.nome}`,
    );

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, FEEDBACK_DURATION);
  }, [demoOrigin.nome]);

  return (
    <MapProvider
      value={{
        state: {
          visibleStations,
          recommendedStations,
          fallbackStations: demoStations,
          origin: demoOrigin,
          now,
          dark:
            Platform.OS === "android" &&
            userPreferences.appearanceMode === "dark",
          batteryPercent,
          vehicleRangeKm,
          hasSearch,
          hasFilters,
          filters,
          searchTerm,
          horizontalInset,
          isOpeningDetails,
          feedbackMessage,
        },
        actions: {
          openStation,
          adjustSearch,
          planTrip,
          onRecentered,
        },
      }}
    >
      <SearchProvider value={search}>{children}</SearchProvider>
    </MapProvider>
  );
}
