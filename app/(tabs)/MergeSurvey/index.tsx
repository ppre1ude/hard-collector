import { colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Survey {
  id: number;
  name: string;
  date: string;
  items: { name: string; count: number }[];
}

export default function MergeSurveyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (심플한 화이트 헤더) */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={28} color="#4F7327" />
        <Text style={styles.headerTitle}>병합할 작업 선택</Text>
        <View style={{ width: 28 }} />
        {/* 타이틀 중앙 정렬을 위한 빈 공간 */}
      </View>
      <View style={styles.container}></View>
      {/* 3. Bottom Navigation Bar */}
      <View style={{ height: 70 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#4F7327",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
            }}
          >
            저장
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF5" },
  header: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    height: 110,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: colors.BLACK },
  headerIcons: { flexDirection: "row" },
  iconButton: { marginLeft: 15 },

  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: "white",
    marginBottom: 5,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4F7327",
    marginRight: 10,
    backgroundColor: "white",
  },
  activeTab: { backgroundColor: "#4F7327", borderColor: "#4F7327" },
  activeTabText: { color: "white", fontWeight: "bold" },
  tabText: { color: "#4F7327" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  listHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  fileCount: { color: "#888", fontSize: 13 },
  sortButton: { marginLeft: 10 },
  sortText: { color: "#AAA", fontSize: 13 },
  activeSortText: { color: "#4F7327", fontWeight: "bold" },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileIconBox: {
    width: 50,
    height: 50,
    backgroundColor: "#E8F5D6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  csvBadge: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#4F7327",
    marginTop: -2,
  },
  fileInfo: { flex: 1, marginLeft: 15 },
  fileName: { fontSize: 15, fontWeight: "600", color: "#333" },
  fileDate: { fontSize: 12, color: "#AAA", marginTop: 4 },

  uploadArea: {
    marginTop: 10,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#B5D1A0",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#F1F8E9",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  uploadTitle: { fontSize: 18, fontWeight: "bold", color: "#4F7327" },
  uploadSubtitle: { fontSize: 12, color: "#AAA", marginTop: 5 },

  emptyState: { padding: 40, alignItems: "center" },
  emptyText: { color: "#AAA" },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#4F7327",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 34,
  },
});
