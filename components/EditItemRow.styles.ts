import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    height: 60,
  },
  indexText: {
    fontSize: 16,
    color: "#000",
    width: 30,
    fontWeight: "500",
  },
  nameText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    textAlign: "left",
    paddingRight: 10,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 120,
  },
  circleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#CFE869",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20,
  },
  countText: {
    fontSize: 15,
    fontWeight: "500",
    marginHorizontal: 8,
    color: "#000",
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
