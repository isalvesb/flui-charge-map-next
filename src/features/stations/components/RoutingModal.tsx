import { useCurrentTime } from "@/src/hooks/useCurrentTime";
import { useExternalMapApp } from "@/src/hooks/useExternalApp";
import { useTelaComPreferencias } from "@/src/hooks/useTelaComPreferencias";
import { ChargingStation } from "@/src/types";
import { canChargeAt } from "@/src/utils/stationAvailability";
import type { LocationObject } from "expo-location";
import { useEffect, useRef, useState } from "react";
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
  origin?: Pick<ChargingStation, "latitude" | "longitude">;
  openDialog: (param: boolean) => void;
};

type RoutingModalPermissionType = {
  next: (location: LocationObject | null) => void;
  onCancel: () => void;
};

export const RoutingModalRoutes = ({
  station,
  origin,
  openDialog,
}: RoutingModalRoutesType) => {
  const now = useCurrentTime();
  const { styles } = useTelaComPreferencias(baseStyles);
  const { routeToExternalApp, isLoading, error } = useExternalMapApp(station, origin);

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
        {!origin ? (
          <Text style={styles.routeDescription}>
            Sem localização compartilhada. O aplicativo de navegação definirá a origem.
          </Text>
        ) : null}
        {error ? (
          <Text style={styles.routeDescription} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
        {(["google", "waze"] as const).map((provider) => (
          <Pressable
            key={provider}
            accessibilityRole="button"
            disabled={isLoading}
            style={styles.routeAction}
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
            onPress={() => void routeToExternalApp(provider)}
          >
            <Text style={styles.primaryActionText}>
              {provider === "google" ? "Abrir Google Maps" : "Abrir Waze"}
            </Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          disabled={isLoading}
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
  onCancel,
}: RoutingModalPermissionType) => {
  const { getCurrentLocation } = useLocationContext();
  const { styles } = useTelaComPreferencias(baseStyles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  const handleNext = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const result = await getCurrentLocation();
      if (!active.current) return;
      if (result.status === "success") {
        next(result.location);
      } else {
        setError(result.status === "permission-denied"
          ? "Acesso à localização não permitido. Verifique a permissão nos Ajustes ou continue sem compartilhar sua localização."
          : "Não foi possível obter sua localização agora. Verifique o sinal e os serviços de localização e tente novamente.");
      }
    } catch {
      if (active.current) setError("Não foi possível obter sua localização agora. Tente novamente.");
    } finally {
      if (active.current) setIsLoading(false);
    }
  };

  return (
    <View style={styles.routeBackdrop}>
      <View style={styles.routeDialog} accessibilityViewIsModal>
        <Text style={styles.routeTitle} accessibilityRole="header">
          Deseja compartilhar sua localização?
        </Text>
        <Text style={styles.routeDescription}>
          Podemos usar a localização atual do dispositivo como origem no aplicativo de navegação.
        </Text>
        {error ? (
          <Text style={styles.routeDescription} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          style={styles.routeAction}
          disabled={isLoading}
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
          onPress={() => void handleNext()}
        >
          <Text style={styles.primaryActionText}>
            {isLoading ? "Obtendo localização..." : error ? "Tentar novamente" : "Continuar"}
          </Text>
        </Pressable>
        {error ? (
          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            style={styles.routeAction}
            onPress={() => next(null)}
          >
            <Text style={styles.primaryActionText}>Continuar sem localização</Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          style={[styles.routeAction, styles.routeCancelAction]}
          onPress={onCancel}
        >
          <Text style={styles.secondaryActionText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
};
