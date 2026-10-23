import { Modal, Pressable, Text, View } from "react-native";

import { PressableScale } from "../../../components";
import { styles } from "./LocationPermissionModal.styles";
import type { LocationPermissionModalProps } from "./LocationPermissionModal.types";

export function LocationPermissionModal({
  visible,
  onAllow,
  onDecline,
}: LocationPermissionModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDecline}
    >
      <View style={styles.overlay} accessibilityViewIsModal>
        <View style={styles.card}>
          <Text style={styles.title} accessibilityRole="header">
            Usar sua localização?
          </Text>
          <Text style={styles.body}>
            A FluIA busca lugares perto de você. Se você recusar, a busca usa a
            ARCA em São Paulo.
          </Text>
          <View style={styles.actions}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Permitir"
              pressedScale={0.98}
              style={styles.allowButton}
              onPress={() => {
                void onAllow();
              }}
            >
              <Text style={styles.allowLabel}>Permitir</Text>
            </PressableScale>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Agora não"
              style={styles.declineButton}
              onPress={onDecline}
            >
              <Text style={styles.declineLabel}>Agora não</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
