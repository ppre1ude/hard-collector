import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  indexText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    width: 30,
  },
  nameText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  rightContainer: {
    width: 60,
    alignItems: "flex-end",
  },
  countText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  fixedUnit: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
});
