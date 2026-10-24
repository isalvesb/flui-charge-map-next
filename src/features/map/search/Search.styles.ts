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
  searchBar: {
    height: 58,
    marginTop: 14,
    paddingLeft: 18,
    paddingRight: 10,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    ...softShadow,
  },

  searchText: {
    flex: 1,
    marginLeft: 13,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "500",
  },

  searchDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
    backgroundColor: colors.border,
  },

  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  quickFiltersArea: {
    marginTop: 4,
  },

  filtersContent: {
    paddingTop: 4,
    paddingRight: 8,
    gap: 4,
  },

  chip: {
    minHeight: 44,
    paddingVertical: 8,
    marginRight: 4,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...softShadow,
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  chipTextActive: {
    color: colors.white,
  },
});

export default styles;
