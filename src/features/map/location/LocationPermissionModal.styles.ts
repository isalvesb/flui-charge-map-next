import { StyleSheet } from "react-native";

import { colors, radius, spacing, typography } from "../../../theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: "rgba(8, 10, 18, 0.45)",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    fontSize: typography.sizes.xl,
    lineHeight: typography.lineHeights.xl,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
  },
  actions: {
    gap: spacing.sm,
  },
  allowButton: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  allowLabel: {
    ...typography.body,
    color: colors.white,
    fontWeight: typography.weights.medium,
    fontSize: typography.sizes.md,
  },
  declineButton: {
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  declineLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    fontSize: typography.sizes.md,
  },
});
