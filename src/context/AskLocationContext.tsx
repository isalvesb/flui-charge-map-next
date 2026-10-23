import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as Location from "expo-location";

import { acquireCurrentLocation } from "../utils/currentLocation";

type MapFix = {
  latitude: number;
  longitude: number;
};

type AskLocationSession = {
  ready: boolean;
  needsPrompt: boolean;
  fix: MapFix | null;
  allow: () => Promise<void>;
  decline: () => void;
};

const AskLocationContext = createContext<AskLocationSession | null>(null);

const arca = { latitude: -23.5358, longitude: -46.7454 };

export function AskLocationProvider({ children }: { children: ReactNode }) {
  const [needsPrompt, setNeedsPrompt] = useState(false);
  const [fix, setFix] = useState<MapFix | null>(null);

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

  const value = useMemo<AskLocationSession>(
    () => ({
      ready: fix !== null,
      needsPrompt,
      fix,
      allow,
      decline: storeArca,
    }),
    [allow, fix, needsPrompt, storeArca],
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
