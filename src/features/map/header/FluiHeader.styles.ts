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

const softShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.035,
  shadowRadius: 10,
  elevation: 2,
};

const styles = StyleSheet.create({
  header: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerActions: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...softShadow,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  vehicleButton: {
    maxWidth: 190,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  vehicleInfo: {
    flexShrink: 1,
    alignItems: "flex-end",
    gap: 1,
  },

  vehicleImage: {
    width: 60,
    height: 40,
  },

  vehicleBatteryPill: {
    minHeight: 20,
    paddingHorizontal: 7,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: colors.white,
    borderWidth: 1,
  },

  vehicleBatteryIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  vehicleBatteryIcon: {
    width: 20,
    height: 10,
    padding: 1,
    overflow: "hidden",
    borderWidth: 1.4,
    borderRadius: 3,
  },

  vehicleBatteryLevel: {
    height: "100%",
    borderRadius: 1,
  },

  vehicleBatteryCap: {
    width: 2,
    height: 5,
    marginLeft: 1,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },

  vehicleBatteryText: {
    fontSize: 10,
    fontWeight: "900",
  },

  vehicleBatterySource: {
    maxWidth: 116,
    color: colors.textLight,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },

  vehicleBatteryUpdatedAt: {
    color: colors.textLight,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600",
  },
});

export default styles;
