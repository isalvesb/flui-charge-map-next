import { useCurrentTime } from "@/src/hooks/useCurrentTime";
import { useExternalMapApp } from "@/src/hooks/useExternalApp";
import { useTelaComPreferencias } from "@/src/hooks/useTelaComPreferencias";
import { ChargingStation } from "@/src/types";
import { canChargeAt } from "@/src/utils/stationAvailability";
import { LocationObject } from "expo-location";
import { Pressable, Text, View } from "react-native";
import { styles as baseStyles } from "../PointDetailsScreen.styles";
import { getStationStatusInfo } from "../stationPresentation";
import { useLocationContext } from "@/src/context/LocationContext";

export function getStationRouteNotice(
  station: ChargingStation,
  date = new Date(),
) {
  const status = getStationStatusInfo(station, date);
  const availability = canChargeAt(station, date)
    ? "A abertura e os carregadores livres são demonstrativos."
    : `${status.description}. A recarga não está confirmada neste ponto.`;
  return `Nos dados demonstrativos: ${status.label}. ${availability} Abrir a rota não garante atendimento; confirme o funcionamento e a compatibilidade antes de ir.`;
}

type RoutingModalRoutesType = {
  station: ChargingStation;
  isLoadingAction: boolean;
  routeError: string | null;
  openDialog: (param: boolean) => void;
};

type RoutingModalPermissionType = {
  next: (location: LocationObject | null) => void;
};

export const RoutingModalRoutes = ({
  station,
  isLoadingAction,
  routeError,
  openDialog,
}: RoutingModalRoutesType) => {
  const now = useCurrentTime();
  const { styles } = useTelaComPreferencias(baseStyles);
  const { routeToExternalApp } = useExternalMapApp(station);
  const { location } = useLocationContext();
  console.log(location?.coords);

  return (
    <View style={styles.routeBackdrop}>
      <View style={styles.routeDialog} accessibilityViewIsModal>
        <Text style={styles.routeTitle} accessibilityRole="header">
          Antes de iniciar a rota
        </Text>
        <Text style={styles.routeDescription}>{station.name}</Text>
        <Text style={styles.routeDescription} accessibilityLiveRegion="polite">
          {getStationRouteNotice(station, now)}
        </Text>
        {routeError ? (
          <Text style={styles.routeDescription} accessibilityRole="alert">
            {routeError}
          </Text>
        ) : null}
        {(["google", "waze"] as const).map((provider) => (
          <Pressable
            key={provider}
            accessibilityRole="button"
            disabled={isLoadingAction}
            style={styles.routeAction}
            onPress={() => station && routeToExternalApp(provider)}
          >
            <Text style={styles.primaryActionText}>
              {provider === "google" ? "Abrir Google Maps" : "Abrir Waze"}
            </Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          disabled={isLoadingAction}
          style={[styles.routeAction, styles.routeCancelAction]}
          onPress={() => openDialog(false)}
        >
          <Text style={styles.secondaryActionText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const RoutingModalPermission = ({
  next,
}: RoutingModalPermissionType) => {
  const { getCurrentLocation } = useLocationContext();
  const { styles } = useTelaComPreferencias(baseStyles);
  const handleNext = async () => {
    const location = await getCurrentLocation();

    next && next(location || null);
  };

  return (
    <View style={styles.routeBackdrop}>
      <View style={styles.routeDialog} accessibilityViewIsModal>
        <Text style={styles.routeTitle} accessibilityRole="header">
          Deseja compartilhar sua localização?
        </Text>
        <Text style={styles.routeDescription}>
          Assim podemos definir uma rota à partir da sua localização atual
          aproximada.
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.routeAction}
          onPress={handleNext}
        >
          <Text style={styles.primaryActionText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
};
