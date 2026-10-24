import { StyleSheet } from "react-native";

export const colors = {
  background: "#F3F8F4",
  white: "#FCFEFA",
  text: "#10221E",
  textMuted: "#3F554F",
  textLight: "#63766F",
  primary: "#2B0055",
  primarySoft: "#EAF1FF",
  primarySoftStrong: "#CFE8D9",
  green: "#1FA971",
  yellow: "#FFF2C7",
  yellowDark: "#F4B942",
  border: "#DDE8E3",
  shadow: "#12302A",
};

const shadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
};

const styles = StyleSheet.create({
  fixedMapControls: {
    position: "absolute",
    right: 16,
    top: 18,
    width: 52,
    alignItems: "center",
    gap: 10,
    zIndex: 12,
  },

  mapControlsCompact: {
    top: 12,
    width: "auto",
    flexDirection: "row",
  },

  zoomPillCompact: {
    width: 104,
    height: 52,
    flexDirection: "row",
  },

  zoomDividerCompact: {
    width: 1,
    height: 28,
  },

  zoomPill: {
    width: 52,
    height: 104,
    borderRadius: 26,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  zoomPillButton: {
    width: 52,
    height: 51,
    alignItems: "center",
    justifyContent: "center",
  },

  zoomPillButtonActive: {
    backgroundColor: colors.primarySoft,
  },

  zoomPillDivider: {
    width: 28,
    height: 1,
    backgroundColor: colors.border,
  },

  mapControlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  mapControlButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoftStrong,
  },

  mapControlButtonLoading: {
    opacity: 0.68,
  },

  mapControlText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 31,
  },
});

export default styles;
