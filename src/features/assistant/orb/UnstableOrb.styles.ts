import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "../../../theme";

export const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xxl,
  },
  fallbackText: {
    ...typography.body,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: "center",
  },
});
