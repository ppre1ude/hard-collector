import { StyleSheet } from "react-native";

import { colors } from "@/constants";

export const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: colors.GRAY_700,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 44,
    borderRadius: 8,
  },
  filled: {
    backgroundColor: colors.GRAY_100,
  },
  standard: {},
  outline: {},
  input: {
    fontSize: 14,
    padding: 0,
    flex: 1,
  },
});
