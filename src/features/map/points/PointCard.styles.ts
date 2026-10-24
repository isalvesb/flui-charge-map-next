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
  pointCard: {
    marginTop: 10,
    padding: 13,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.background,
    alignItems: "flex-start",
    ...softShadow,
  },

  pointCardTopRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pointCardTags: {
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },

  pointBadge: {
    maxWidth: "100%",
    alignSelf: "flex-start",
    minHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primarySoft,
  },

  pointBadgeText: {
    flexShrink: 1,
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  pointStationName: {
    marginTop: 8,
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  pointAddress: {
    marginTop: 3,
    color: colors.textLight,
    fontSize: 13,
    fontWeight: "500",
  },

  pointInlineMetaRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  pointAutonomiaChip: {
    maxWidth: "100%",
    alignSelf: "flex-start",
    minHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pointAutonomiaChipText: {
    flexShrink: 1,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
});

export default styles;
