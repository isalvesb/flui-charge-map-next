import { useMemo } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import { SvgXml } from "react-native-svg";

import { PressableScale } from "../../../components";
import { useAppPreferences } from "../../../context/PreferencesContext";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import { calcularAutonomiaAtualKm } from "../../../utils/autonomia";
import { getBatterySourceLabels } from "../../../utils/batteryData";
import { obterCorDeBateriaAtual } from "./FluiHeader.utils";
import { criarLogoFluiXml } from "./FluiHeader.logo";
import type { FluiHeaderActionProps, FluiHeaderProps } from "./FluiHeader.types";
import baseStyles, { colors as baseColors } from "./FluiHeader.styles";

const imagemPerfilUsuario = require("@/assets/user/profile1.webp");
const imagemCarroUsuario = require("@/assets/user/car1.png");

function FluiHeaderFrame({ children }: FluiHeaderProps) {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const logoFluiDoTema = useMemo(() => {
    return criarLogoFluiXml(
      isDarkMode ? "#F3E9FF" : colors.primary,
      isDarkMode ? "#D8C7FF" : "#9B35F5",
    );
  }, [colors.primary, isDarkMode]);

  return (
    <View style={styles.header}>
      <SvgXml xml={logoFluiDoTema} width={76} height={36} />
      {children}
    </View>
  );
}

function FluiHeaderActions({ children }: FluiHeaderProps) {
  const { styles } = useTelaComPreferencias(baseStyles, baseColors);

  return <View style={styles.headerActions}>{children}</View>;
}

function FluiHeaderVehicle({ onPress }: FluiHeaderActionProps) {
  const { styles, colors, fontScale } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const { width: larguraJanela, fontScale: escalaFonteSistema } =
    useWindowDimensions();
  const { userPreferences } = useAppPreferences();
  const batteryLabels = getBatterySourceLabels(userPreferences);
  const batteryPercent = userPreferences.batteryPercent;
  const vehicleRangeKm = userPreferences.vehicleRangeKm;
  const corBateriaAtual = obterCorDeBateriaAtual(batteryPercent, colors);
  const autonomiaAtualKm = Math.round(
    calcularAutonomiaAtualKm(vehicleRangeKm, batteryPercent),
  );
  const cabecalhoCompacto =
    larguraJanela <= 360 || fontScale * escalaFonteSistema > 1.3;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${userPreferences.vehicleName}. Bateria para estimativa: ${batteryPercent} por cento. ${batteryLabels.source}. ${batteryLabels.detail}. Cerca de ${autonomiaAtualKm} quilômetros estimados`}
      accessibilityHint="Toque para ajustar o nível de bateria e ver o alcance nos pontos."
      style={styles.vehicleButton}
      onPress={onPress}
    >
      <View style={styles.vehicleInfo}>
        <View
          style={[
            styles.vehicleBatteryPill,
            { borderColor: corBateriaAtual + "55" },
          ]}
        >
          <View style={styles.vehicleBatteryIconRow}>
            <View
              style={[
                styles.vehicleBatteryIcon,
                { borderColor: corBateriaAtual },
              ]}
            >
              <View
                style={[
                  styles.vehicleBatteryLevel,
                  {
                    width: `${batteryPercent}%`,
                    backgroundColor: corBateriaAtual,
                  },
                ]}
              />
            </View>
            <View
              style={[
                styles.vehicleBatteryCap,
                { backgroundColor: corBateriaAtual },
              ]}
            />
          </View>

          <Text
            style={[styles.vehicleBatteryText, { color: corBateriaAtual }]}
          >
            {batteryPercent}%
          </Text>
        </View>

        <Text style={styles.vehicleBatterySource} numberOfLines={1}>
          {batteryLabels.source}
        </Text>
        <Text style={styles.vehicleBatteryUpdatedAt}>
          {batteryLabels.detail}
        </Text>
      </View>

      <Image
        source={imagemCarroUsuario}
        style={[
          styles.vehicleImage,
          cabecalhoCompacto && { display: "none" },
        ]}
        resizeMode="cover"
      />
    </PressableScale>
  );
}

function FluiHeaderProfile({ onPress }: FluiHeaderActionProps) {
  const { styles } = useTelaComPreferencias(baseStyles, baseColors);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Abrir perfil"
      style={styles.profileButton}
      onPress={onPress}
    >
      <Image
        source={imagemPerfilUsuario}
        style={styles.profileImage}
        resizeMode="cover"
      />
    </PressableScale>
  );
}

export const FluiHeader = Object.assign(FluiHeaderFrame, {
  Actions: FluiHeaderActions,
  Vehicle: FluiHeaderVehicle,
  Profile: FluiHeaderProfile,
});
