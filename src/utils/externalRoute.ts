import { externalActionBlock, type ConnectionStatus } from "./connectivity";
import { getStationRouteUrl, type RouteProvider } from "../features/stations/stationPresentation";
import type { ChargingStation } from "../types";

type Coordinates = Pick<ChargingStation, "latitude" | "longitude">;
type ExternalLinking = {
  canOpenURL: (url: string) => Promise<boolean>;
  openURL: (url: string) => Promise<unknown>;
};

export async function openExternalRoute(
  station: Coordinates,
  provider: RouteProvider,
  origin: Coordinates | undefined,
  linking: ExternalLinking,
  checkConnection?: () => Promise<ConnectionStatus>,
): Promise<string | null> {
  if (!Number.isFinite(station.latitude) || !Number.isFinite(station.longitude)) {
    return "Este ponto ainda não possui coordenadas cadastradas.";
  }

  try {
    if (checkConnection) {
      const blocked = externalActionBlock(await checkConnection());
      if (blocked) return blocked;
    }
    const url = getStationRouteUrl(station, provider, origin);
    if (!(await linking.canOpenURL(url))) {
      return "Seu dispositivo não conseguiu abrir o aplicativo de mapas. Tente novamente ou escolha outro aplicativo.";
    }
    await linking.openURL(url);
    return null;
  } catch {
    return "Não foi possível abrir a rota agora. Tente novamente ou escolha outro aplicativo.";
  }
}
