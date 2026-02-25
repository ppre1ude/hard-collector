import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
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

export default function SurveyManagementScreen() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "name">("latest");

  useFocusEffect(
    useCallback(() => {
      const loadSurveysFromFile = async () => {
        const filePath = `${FileSystem.documentDirectory}Hard_Terminal`;
        try {
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if (fileInfo.exists) {
            const fileContent = await FileSystem.readAsStringAsync(filePath);
            if (fileContent) {
              const parsedData = JSON.parse(fileContent);
              if (Array.isArray(parsedData)) {
                setSurveys(parsedData);
                return;
              }
            }
          }
          setSurveys([]);
        } catch (error) {
          console.error("Failed to read or parse surveys:", error);
          setSurveys([]);
        }
      };
      loadSurveysFromFile();
    }, []),
  );

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
      });
      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const csvContent = await FileSystem.readAsStringAsync(fileUri);

      const lines = csvContent.split("\n");
      const items: { name: string; count: number }[] = [];
      let dataStarted = false;

      for (const line of lines) {
        if (!dataStarted) {
          if (line.includes("순번,항목 이름,수량")) dataStarted = true;
          continue;
        }
        const parts = line.split(",");
        if (parts.length >= 3) {
          const name = parts[1].replace(/"/g, "").trim();
          const count = parseInt(parts[2].trim(), 10);
          if (name && !isNaN(count)) items.push({ name, count });
        }
      }

      if (items.length === 0) {
        Alert.alert("알림", "CSV에서 유효한 데이터를 찾을 수 없습니다.");
        return;
      }

      const tempSurvey: Survey = {
        id: Date.now(),
        name: result.assets[0].name,
        date: new Date().toISOString(),
        items: items,
      };

      // 목록에 추가함과 동시에 데이터 저장 (파일 시스템)
      const newSurveys = [tempSurvey, ...surveys];
      const filePath = `${FileSystem.documentDirectory}Hard_Terminal`;
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(newSurveys, null, 2),
      );
      setSurveys(newSurveys);

      // 재고 조사 메인 화면으로 자동 이동
      router.push({
        pathname: "/StockTaking",
        params: { survey: JSON.stringify(tempSurvey) },
      });
    } catch (error) {
      Alert.alert("오류", "파일을 가져오는 중 문제가 발생했습니다.");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("파일 삭제", "정말로 이 파일을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const updatedSurveys = surveys.filter((survey) => survey.id !== id);
          const filePath = `${FileSystem.documentDirectory}Hard_Terminal`;
          try {
            await FileSystem.writeAsStringAsync(
              filePath,
              JSON.stringify(updatedSurveys, null, 2),
            );
            setSurveys(updatedSurveys);
            Alert.alert("성공", "파일이 성공적으로 삭제되었습니다.");
          } catch (error) {
            Alert.alert("오류", "파일 삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const sortedSurveys = [...surveys].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>조사 관리</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>전체 파일</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.listHeader}>
          <Text style={styles.fileCount}>총 {surveys.length}개의 파일</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setSortOrder("latest")}
              style={styles.sortButton}
            >
              <Text
                style={[
                  styles.sortText,
                  sortOrder === "latest" && styles.activeSortText,
                ]}
              >
                최신순
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortOrder("name")}
              style={styles.sortButton}
            >
              <Text
                style={[
                  styles.sortText,
                  sortOrder === "name" && styles.activeSortText,
                ]}
              >
                이름순
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* File List */}
        {sortedSurveys.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>저장된 항목이 없습니다.</Text>
          </View>
        ) : (
          sortedSurveys.map((survey) => (
            <TouchableOpacity
              key={survey.id}
              style={styles.fileCard}
              onPress={() =>
                router.push({
                  pathname: "/StockTaking",
                  params: { survey: JSON.stringify(survey) },
                })
              }
            >
              <View style={styles.fileIconBox}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={30}
                  color="#4F7327"
                />
                <Text style={styles.csvBadge}>CSV</Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {survey.name}
                </Text>
                <Text style={styles.fileDate}>
                  {new Date(survey.date).toLocaleDateString()} ·{" "}
                  {survey.items.length} 항목
                </Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(survey.id);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#C0C0C0" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        {/* Upload Area (Dashed Border) */}
        <TouchableOpacity style={styles.uploadArea} onPress={handleImport}>
          <View style={styles.uploadIconCircle}>
            <MaterialCommunityIcons
              name="folder-open"
              size={28}
              color="#4F7327"
            />
          </View>
          <Text style={styles.uploadTitle}>찾아보기...</Text>
          <Text style={styles.uploadSubtitle}>
            로컬 탐색기에서 파일을 선택하세요
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/StockTaking")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
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
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#4F7327" },
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
