import React from "react";
import { Text, View } from "react-native";
import { Award } from "lucide-react-native";
import type { AppTheme } from "@/src/theme/appTheme";
import { progressoNivel } from "../levels";
import { ROTULO_NIVEL, formatarPontos } from "../rewardsView";
import type { RewardsStyles } from "../RewardsScreen.styles";
import type { Pontos } from "../types";

type Props = {
  pontos: Pontos;
  theme: AppTheme;
  styles: RewardsStyles;
};

export function LevelCard({ pontos, theme, styles }: Props) {
  const progresso = progressoNivel(pontos.acumulado);
  const percentual = Math.round(progresso.fracao * 100);
  const nomeNivel = ROTULO_NIVEL[progresso.nivel];

  return (
    <View
      style={styles.levelCard}
      accessible
      accessibilityLabel={`Nível ${nomeNivel}. Saldo ${formatarPontos(pontos.saldo)}.`}
    >
      <View style={styles.levelPill}>
        <Award size={14} color={theme.onPrimary} />
        <Text style={styles.levelPillText}>Nível {nomeNivel}</Text>
      </View>

      <View style={styles.balanceRow}>
        <Text style={styles.balance}>
          {pontos.saldo.toLocaleString("pt-BR")}
        </Text>
        <Text style={styles.balanceUnit}>pts</Text>
      </View>
      <Text style={styles.balanceLabel}>Saldo disponível para resgate</Text>

      {progresso.proximo ? (
        <>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              Rumo ao nível {ROTULO_NIVEL[progresso.proximo]}
            </Text>
            <Text style={styles.progressText}>
              Faltam {progresso.faltam} pts
            </Text>
          </View>

          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: percentual }}
          >
            <View style={[styles.progressFill, { width: `${percentual}%` }]} />
          </View>
        </>
      ) : (
        <Text style={styles.progressText}>Você chegou ao nível máximo</Text>
      )}
    </View>
  );
}
