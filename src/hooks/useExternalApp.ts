import { useState } from "react";
import { Linking } from "react-native";
import { useLocationContext } from "../context/LocationContext";
import { getStationRouteUrl, type RouteProvider } from "../features/stations/stationPresentation";
import { ChargingStation } from "../types";

type ExternalMapErrorType = null | string;

type ExternamMapResponseType = {
  error: ExternalMapErrorType;
  isLoading: boolean;
  routeToExternalApp: (provider: RouteProvider) => void;
};

export function useExternalMapApp(
  station: ChargingStation,
): ExternamMapResponseType {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ExternalMapErrorType>(null);
  const { location } = useLocationContext();

  const routeToExternalApp = async (provider: RouteProvider) => {
    const hasCoordinates =
      Number.isFinite(station.latitude) && Number.isFinite(station.longitude);

    if (!hasCoordinates) {
      setError("Este ponto ainda não possui coordenadas cadastradas.");
    }

    const url = getStationRouteUrl(station, provider, location?.coords);

    try {
      setIsLoading(true);
      const canOpen = Linking.canOpenURL(url);

      if (!canOpen) {
        setError("Seu dispositivo não conseguiu abrir o aplicativo de mapas.");

        return;
      }

      await Linking.openURL(url);
    } catch {
      setError(
        "Não foi possível abrir a rota agora. Tente novamente em alguns instantes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    routeToExternalApp,
  };
}
