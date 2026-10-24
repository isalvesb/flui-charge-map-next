import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Info, Ticket } from "lucide-react-native";

import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { RECOMPENSAS_DEMONSTRATIVAS } from "./catalog";
import { createStyles } from "./RewardsScreen.styles";
import { QrCode } from "./components/QrCode";
import { lerVouchers } from "./storage";
import { estaExpirado } from "./voucher";
import type { Voucher } from "./types";

export default function VoucherScreen() {
  const { theme, scale } = useAppPreferences();
  const styles = useMemo(() => createStyles(theme, scale), [theme, scale]);
  const { voucherId } = useLocalSearchParams<{ voucherId?: string }>();
  const [voucher, setVoucher] = useState<Voucher | null | undefined>(undefined);

  useEffect(() => {
    lerVouchers().then((lista) => {
      setVoucher(lista.find((item) => item.id === voucherId) ?? null);
    });
  }, [voucherId]);

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/rewards" as Href);
    }
  }

  const recompensa = voucher
    ? RECOMPENSAS_DEMONSTRATIVAS.find((item) => item.id === voucher.recompensaId)
    : undefined;
  const expirado = voucher ? estaExpirado(voucher, Date.now()) : false;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={voltar}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={theme.text} />
        </PressableScale>
        <View style={styles.headerText}>
          <Text style={styles.title}>Voucher</Text>
          <Text style={styles.subtitle}>Resgate da recompensa</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {voucher === undefined ? (
          <Text style={styles.loading}>Carregando voucher…</Text>
        ) : !voucher || !recompensa ? (
          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Voucher não encontrado</Text>
            <Text style={styles.rewardDetail}>Volte às recompensas e tente o resgate novamente.</Text>
          </View>
        ) : (
          <>
            <View style={styles.rewardCard}>
              <View style={styles.rewardTop}>
                <View style={styles.rewardIcon}>
                  <Ticket size={22} color={theme.primary} />
                </View>
                <View style={styles.flex}>
                  <View style={styles.partnerPill}>
                    <Text style={styles.partnerPillText}>Parceiro</Text>
                  </View>
                  <Text style={styles.partnerName}>{recompensa.parceiro}</Text>
                  <Text style={styles.rewardTitle}>{recompensa.titulo}</Text>
                </View>
              </View>
              <Text style={styles.rewardDetail}>
                Válido até {new Date(voucher.expiraEm).toLocaleDateString("pt-BR")}
              </Text>

              <View style={styles.qrBox}>
                <QrCode valor={voucher.codigo} tamanho={200} />
              </View>
              <Text style={styles.voucherLabel}>Código do voucher</Text>
              <View style={styles.codeBox} accessible accessibilityLabel={`Código ${voucher.codigo}`}>
                <Text style={styles.codeText} selectable>{voucher.codigo}</Text>
              </View>
              <Text style={styles.voucherHint}>
                Apresente este código ao operador do ponto parceiro.
              </Text>
            </View>

            {expirado ? (
              <Text style={styles.expiredText}>Este voucher expirou.</Text>
            ) : (
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Usar no ponto de recarga"
                onPress={() =>
                  Alert.alert(
                    "Apresente o código",
                    `Mostre ${voucher.codigo} ao operador de ${recompensa.parceiro}.`,
                  )
                }
                style={styles.redeemButton}
              >
                <Text style={styles.redeemText}>Usar no ponto de recarga</Text>
              </PressableScale>
            )}

            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Voltar às recompensas"
              onPress={() => router.replace("/rewards" as Href)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryText}>Voltar às recompensas</Text>
            </PressableScale>
          </>
        )}

        <View style={styles.disclaimer}>
          <Info size={16} color={theme.textMuted} />
          <Text style={styles.disclaimerText}>
            Recompensas simuladas no protótipo · Financiadas por parceiros
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
