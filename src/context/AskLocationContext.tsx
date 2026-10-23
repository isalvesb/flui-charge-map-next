import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as Location from "expo-location";

import {
  fetchNearbyPlaces,
  type AskedPlace,
  type NearbyPlace,
} from "../features/assistant/askPlaces";
import { acquireCurrentLocation } from "../utils/currentLocation";

type MapFix = {
  latitude: number;
  longitude: number;
};

type AskLocationSession = {
  ready: boolean;
  needsPrompt: boolean;
  fix: MapFix | null;
  places: AskedPlace[];
  askedCards: NearbyPlace[];
  drawerToken: number;
  allow: () => Promise<void>;
  decline: () => void;
  showPlaces: (places: AskedPlace[]) => Promise<void>;
};

const AskLocationContext = createContext<AskLocationSession | null>(null);

const arca = { latitude: -23.5358, longitude: -46.7454 };

function placesOnTheMap(places: AskedPlace[]) {
  return places.filter(
    (place) =>
      Number.isFinite(place.latitude) &&
      Number.isFinite(place.longitude) &&
      Math.abs(place.latitude) <= 90 &&
      Math.abs(place.longitude) <= 180,
  );
}

export function AskLocationProvider({ children }: { children: ReactNode }) {
  const [needsPrompt, setNeedsPrompt] = useState(false);
  const [fix, setFix] = useState<MapFix | null>(null);
  const [places, setPlaces] = useState<AskedPlace[]>([]);
  const [askedCards, setAskedCards] = useState<NearbyPlace[]>([]);
  const [drawerToken, setDrawerToken] = useState(0);
  const fixRef = useRef(fix);
  fixRef.current = fix;

  const storeArca = useCallback(() => {
    setNeedsPrompt(false);
    setFix(arca);
  }, []);

  const storeDeviceFix = useCallback(async () => {
    const result = await acquireCurrentLocation(Location);
    if (result.status !== "success") {
      storeArca();
      return;
    }
    setNeedsPrompt(false);
    setFix({
      latitude: result.location.coords.latitude,
      longitude: result.location.coords.longitude,
    });
  }, [storeArca]);

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        const current = await Location.getForegroundPermissionsAsync();
        if (!alive) return;

        if (current.granted) {
          await storeDeviceFix();
          return;
        }

        if (current.status === "denied" && current.canAskAgain === false) {
          storeArca();
          return;
        }

        setNeedsPrompt(true);
      } catch {
        if (alive) setNeedsPrompt(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [storeArca, storeDeviceFix]);

  const allow = useCallback(async () => {
    await storeDeviceFix();
  }, [storeDeviceFix]);

  const showPlaces = useCallback(async (next: AskedPlace[]) => {
    const usable = placesOnTheMap(next);
    setPlaces(usable);
    if (usable.length === 0) {
      setAskedCards([]);
      return;
    }

    const origin = fixRef.current;
    const categories = [...new Set(usable.map((place) => place.category))];
    const lists = origin
      ? await Promise.all(
          categories.map((category) =>
            fetchNearbyPlaces({
              category,
              latitude: origin.latitude,
              longitude: origin.longitude,
            }),
          ),
        )
      : [];
    const matched = lists.flat().filter((card) =>
      usable.some(
        (place) =>
          place.name === card.name &&
          place.latitude === card.latitude &&
          place.longitude === card.longitude,
      ),
    );
    setAskedCards(
      matched.length > 0
        ? matched
        : usable.map((place) => ({
            ...place,
            address: "",
            rating: 0,
            powerKw: null,
            status: "",
            openingHours: "",
            distanceKm: 0,
          })),
    );
    setDrawerToken((token) => token + 1);
  }, []);

  const value = useMemo<AskLocationSession>(
    () => ({
      ready: fix !== null,
      needsPrompt,
      fix,
      places,
      askedCards,
      drawerToken,
      allow,
      decline: storeArca,
      showPlaces,
    }),
    [
      allow,
      askedCards,
      drawerToken,
      fix,
      needsPrompt,
      places,
      showPlaces,
      storeArca,
    ],
  );

  return (
    <AskLocationContext.Provider value={value}>
      {children}
    </AskLocationContext.Provider>
  );
}

export function useAskLocation() {
  const session = useContext(AskLocationContext);
  if (!session) {
    throw new Error("useAskLocation must be used within AskLocationProvider");
  }
  return session;
}
