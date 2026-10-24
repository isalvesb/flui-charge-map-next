import React from "react";
import { Text, View } from "react-native";
import { Car, Coffee, Zap } from "lucide-react-native";
import { PressableScale } from "../../../components";
import type { AppTheme } from "../../../theme/appTheme";
import type { RecompensaExibicao } from "../catalog";
import { faltamParaResgatar, podeResgatar } from "../rewardsView";
import type { RewardsStyles } from "../RewardsScreen.styles";

const ICONES = { carregador: Zap, cafe: Coffee, vaga: Car } as const;

type Props = {
  recompensa: RecompensaExibicao;
  saldo: number;
  theme: AppTheme;
  styles: RewardsStyles;
  onResgatar: (recompensa: RecompensaExibicao) => void;
};

export function RewardCard({ recompensa, saldo, theme, styles, onResgatar }: Props) {
  const Icone = ICONES[recompensa.icone];
  const liberada = podeResgatar(saldo, recompensa.custoPontos);
  const faltam = faltamParaResgatar(saldo, recompensa.custoPontos);

  return (
    <View style={[styles.rewardCard, !liberada && styles.rewardCardLocked]}>
      <View style={styles.rewardTop}>
        <View style={styles.rewardIcon}>
          <Icone size={22} color={theme.primary} />
        </View>
        <View style={styles.flex}>
          <View style={styles.partnerPill}>
            <Text style={styles.partnerPillText}>Parceiro</Text>
          </View>
          <Text style={styles.partnerName}>{recompensa.parceiro}</Text>
          <Text style={styles.rewardTitle}>{recompensa.titulo}</Text>
        </View>
        <Text style={styles.costBadge}>{recompensa.custoPontos} pts</Text>
      </View>

      <View style={styles.rewardBottom}>
        <Text style={styles.rewardDetail}>{recompensa.detalhe}</Text>
        <PressableScale
          disabled={!liberada}
          onPress={liberada ? () => onResgatar(recompensa) : undefined}
          accessibilityRole="button"
          accessibilityLabel={
            liberada
              ? `Resgatar ${recompensa.titulo}`
              : `${recompensa.titulo}, faltam ${faltam} pontos`
          }
          accessibilityState={{ disabled: !liberada }}
          style={[styles.redeemButton, !liberada && styles.redeemButtonDisabled]}
        >
          <Text style={[styles.redeemText, !liberada && styles.redeemTextDisabled]}>
            {liberada ? "Resgatar" : `Faltam ${faltam} pts`}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}
