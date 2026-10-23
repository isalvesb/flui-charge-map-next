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
  bottomSheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    zIndex: 8,
  },

  bottomSheetContent: {
    paddingHorizontal: 18,
    paddingBottom: 2,
  },

  bottomSheetCard: {
    flexGrow: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },

  sheetHandleArea: {
    minHeight: 44,
    marginTop: 0,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  sheetChevronButton: {
    width: 30,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  sheetHeader: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  originDescription: {
    color: colors.textLight,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },

  restaurarPainelWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
  },

  restaurarPainelPill: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  restaurarPainelPillText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  sheetTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 21,
    fontWeight: "600",
    letterSpacing: -0.35,
  },

  emptyCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoftStrong,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },

  emptyText: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },

  emptyButton: {
    minHeight: 44,
    paddingVertical: 10,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  emptyButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  pointsScroll: {
    maxHeight: 262,
  },

  pointsScrollContent: {
    paddingBottom: 0,
  },

  placeCard: {
    marginTop: 10,
    padding: 13,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  placeName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
  },

  placeMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default styles;
