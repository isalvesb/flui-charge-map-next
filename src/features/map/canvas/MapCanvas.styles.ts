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
  realMap: {
    ...StyleSheet.absoluteFillObject,
  },

  mapTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 34, 30, 0.03)",
  },

  mapTintOverlayDark: {
    backgroundColor: "rgba(5, 12, 20, 0.08)",
  },

  userLocationMarker: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  userLocationPulse: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
  },

  userLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: colors.white,
    ...shadow,
  },
});

export default styles;
