import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import { createContext, useContext, useState } from "react";

type LocationContextType = {
  location?: LocationObject;
  setLocation: (location: LocationObject) => void;
  getCurrentLocation: () => Promise<LocationObject | undefined>;
};

const LocationContext = createContext<LocationContextType | null>(null);

export function LocationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, setLocation] = useState<LocationObject>();

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") return;

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    return location;
  }

  return (
    <LocationContext.Provider
      value={{ location, setLocation, getCurrentLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocationContext deve ser usado dentro de LocationContextProvider.",
    );
  }

  return context;
}
