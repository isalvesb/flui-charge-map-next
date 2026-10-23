import { StyleSheet } from "react-native";
import type { AppTheme } from "../../theme/appTheme";

export function createStyles(theme: AppTheme, scale: (size: number) => number) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
    },

    flex: {
      flex: 1,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },

    headerText: {
      flex: 1,
    },

    title: {
      color: theme.text,
      fontSize: scale(20),
      fontWeight: "700",
    },

    subtitle: {
      color: theme.textMuted,
      fontSize: scale(13),
    },

    content: {
      paddingHorizontal: 16,
      paddingBottom: 32,
      gap: 12,
    },

    loading: {
      color: theme.textMuted,
      fontSize: scale(14),
    },

    sectionTitle: {
      color: theme.text,
      fontSize: scale(17),
      fontWeight: "700",
      marginTop: 8,
    },

    sectionHint: {
      color: theme.textMuted,
      fontSize: scale(13),
      marginTop: -8,
    },

    levelCard: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      padding: 20,
      gap: 8,
    },

    levelPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.onPrimary + "22",
    },

    levelPillText: {
      color: theme.onPrimary,
      fontSize: scale(12),
      fontWeight: "700",
    },

    balanceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 6,
    },

    balance: {
      color: theme.onPrimary,
      fontSize: scale(32),
      fontWeight: "700",
    },

    balanceUnit: {
      color: theme.onPrimary,
      fontSize: scale(16),
      fontWeight: "600",
    },

    balanceLabel: {
      color: theme.onPrimary,
      fontSize: scale(13),
      opacity: 0.85,
    },

    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },

    progressText: {
      color: theme.onPrimary,
      fontSize: scale(12),
      fontWeight: "600",
    },

    progressTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.onPrimary + "33",
      overflow: "hidden",
    },

    progressFill: {
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.onPrimary,
    },

    rewardCard: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      gap: 12,
    },

    rewardCardLocked: {
      opacity: 0.7,
    },

    rewardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },

    rewardIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primarySoft,
    },

    partnerPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: theme.primarySoft,
      marginBottom: 4,
    },

    partnerPillText: {
      color: theme.primary,
      fontSize: scale(11),
      fontWeight: "700",
    },

    partnerName: {
      color: theme.textMuted,
      fontSize: scale(12),
    },

    rewardTitle: {
      color: theme.text,
      fontSize: scale(15),
      fontWeight: "700",
      marginTop: 2,
    },

    costBadge: {
      color: theme.primary,
      fontSize: scale(12),
      fontWeight: "700",
      backgroundColor: theme.primarySoftStrong,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: "hidden",
    },

    rewardBottom: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    rewardDetail: {
      flex: 1,
      color: theme.textMuted,
      fontSize: scale(12),
    },

    redeemButton: {
      minHeight: 48,
      minWidth: 112,
      paddingHorizontal: 16,
      borderRadius: 14,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },

    redeemButtonDisabled: {
      backgroundColor: theme.border,
    },

    redeemText: {
      color: theme.onPrimary,
      fontSize: scale(14),
      fontWeight: "700",
    },

    redeemTextDisabled: {
      color: theme.textMuted,
    },

    howCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
    },

    rowTitle: {
      color: theme.text,
      fontSize: scale(14),
      fontWeight: "700",
    },

    rowText: {
      color: theme.textMuted,
      fontSize: scale(12),
    },

    rowBadge: {
      color: theme.primary,
      fontSize: scale(12),
      fontWeight: "700",
      backgroundColor: theme.primarySoftStrong,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: "hidden",
    },

    disclaimer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.primarySoft,
    },

    disclaimerText: {
      flex: 1,
      color: theme.textMuted,
      fontSize: scale(12),
    },
  });
}

export type RewardsStyles = ReturnType<typeof createStyles>;
