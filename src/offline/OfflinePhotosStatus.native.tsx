import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAppPreferences } from "../context/PreferencesContext";
import { createSettingsStyles } from "../features/settings/SettingsScreen.styles";
import { useOfflinePhotosStatus } from "./OfflineAssetsContext.native";
import { offlineImageMetadata } from "./offlineImageMetadata";

export default function OfflinePhotosStatus() {
  const { theme, fontScale } = useAppPreferences();
  const styles = createSettingsStyles(theme, fontScale);
  const { ready, preparing, supported, retry } = useOfflinePhotosStatus();
  const complete = ready === offlineImageMetadata.length;
  return <View style={styles.section}>
    <Text style={styles.sectionTitle}>Uso sem conexão</Text>
    <Text accessibilityLiveRegion="polite" style={styles.sectionText}>
      {!supported ? "A preparação de fotos não está disponível nesta instalação."
        : complete ? "Fotos do perfil, veículo e catálogo preparadas neste dispositivo."
          : preparing ? `Preparando fotos: ${ready} de ${offlineImageMetadata.length}. Mantenha a conexão durante a preparação.`
            : "Algumas fotos ainda não foram preparadas. Conecte-se e tente novamente."}
    </Text>
    <Text style={styles.sectionText}>Mapa de fundo e navegação externa precisam de conexão. A versão de desenvolvimento também precisa do servidor para iniciar o app.</Text>
    {supported && !preparing && !complete ? <Pressable accessibilityRole="button" accessibilityLabel="Preparar fotos para uso sem conexão" style={[styles.optionButton, { marginTop: 12 }]} onPress={retry}>
      <Text style={styles.optionTitle}>Preparar fotos</Text>
    </Pressable> : null}
  </View>;
}
