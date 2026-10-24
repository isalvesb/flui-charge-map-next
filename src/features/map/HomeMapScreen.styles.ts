import { Platform, StyleSheet } from "react-native";

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

const softShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.035,
  shadowRadius: 10,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topArea: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 18 : 8,
    paddingBottom: 14,
    zIndex: 10,
  },

  batterySheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    justifyContent: "flex-end",
  },

  batterySheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 34, 30, 0.35)",
  },

  batterySheetContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
  },

  batterySheetCard: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    flexGrow: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  batterySheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  batterySheetPreviewIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  batterySheetHeaderText: {
    flex: 1,
  },

  batterySheetCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  batterySheetTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  batterySheetSubtitle: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 13.5,
    fontWeight: "700",
  },

  batteryStepperRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  batteryStepperButton: {
    width: 64,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primarySoftStrong,
    ...softShadow,
  },

  batteryStepperButtonDisabled: {
    opacity: 0.35,
  },

  batteryStepperButtonText: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "800",
  },

  batteryStepperValue: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },

  batteryStepperPercent: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  batteryStepperRange: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  batterySheetSafetyHint: {
    marginTop: 14,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  batterySheetDoneButton: {
    minHeight: 48,
    paddingVertical: 12,
    marginTop: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  batterySheetDoneButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },

  quickFiltersHandleArea: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },

  quickFiltersChevronButton: {
    width: 30,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  quickFiltersAnimatedContent: {
    overflow: "hidden",
  },

  fluiAssistantButton: {
    width: "100%",
    minHeight: 52,
    paddingHorizontal: 8,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    zIndex: 14,
    ...shadow,
    elevation: 12,
  },

  fluiAssistantAnimatedButton: {
    height: 52,
    overflow: "visible",
  },

  fluiAssistantButtonText: {
    paddingLeft: 8,
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  fluiAssistantFloating: {
    position: "absolute",
    height: 52,
    alignItems: "flex-end",
    zIndex: 16,
  },

  feedbackToastOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  feedbackToastCard: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    ...shadow,
  },

  feedbackToastText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
});

export default styles;
