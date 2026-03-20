import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF8", // 아주 연한 회색/미색 배경
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Header
  header: {
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  // Top Info Section
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8E9", // 연한 녹색 배경
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#DCEDC8",
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#558B2F",
    fontWeight: "500",
    flex: 1,
  },

  // Barcode Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#4F7327", // 진한 녹색 테두리
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 60,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  barcodeIconContainer: {
    marginRight: 10,
    paddingLeft: 5,
  },
  mainInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  plusButton: {
    backgroundColor: "#4F7327",
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Toggle Row
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  badgeContainer: {
    backgroundColor: "#E6EE9C", // 라임색 배지
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 13,
    color: "#4F7327",
    fontWeight: "bold",
  },

  // Card List
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardCode: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  cardName: {
    width: 200,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  countText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  unitText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 3,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#AED581",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 12,
    color: "#558B2F",
    fontWeight: "bold",
  },

  // Bottom Navigation
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    marginBottom: 34,
  },
  bottomBtn: {
    height: 60,
    width: "32%",
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomBtnWhite: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
  },
  bottomBtnGreen: {
    backgroundColor: "#4F7327",
  },
  bottomBtnTextGray: {
    marginTop: 4,
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
  bottomBtnTextWhite: {
    marginTop: 4,
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});

export default styles;
