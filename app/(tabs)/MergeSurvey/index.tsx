import { colors } from "@/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedID, setSelectedID] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    if (selectedID.includes(id)) {
      //이미 셀렉이 되어 있다면?
      setSelectedID(selectedID.filter((selectedID) => selectedID !== id)); //목록에서 제거
    } else {
      setSelectedID([...selectedID, id]);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header  */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={28} color="#4F7327" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>병합할 작업 선택</Text>
        <View style={{ width: 28 }} />
        {/* 타이틀 중앙 정렬을 위한 빈 공간 */}
      </View>
      {/* 2. Main (작성 필요)  */}
      <View>
        {/* File List */}
        {surveys.map((survey) => {
          // 현재 이 항목이 선택되었는지 확인
          const isSelected = selectedID.includes(survey.id);

          return (
            <TouchableOpacity
              key={survey.id}
              // 스타일 수정: 선택되었으면 테두리색(#4F7327)을 입힘
              style={[
                styles.fileCard,
                isSelected && { borderWidth: 2, borderColor: "#4F7327" },
              ]}
              // 클릭 시 페이지 이동 대신 선택 함수 실행
              onPress={() => toggleSelect(survey.id)}
            >
              {/* ... 기존 내부 코드 ... */}

              {/* (추가 선택 사항) 선택되었을 때만 체크 아이콘 표시 */}
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#4F7327"
                  style={{ marginLeft: 10 }}
                />
              )}

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
            </TouchableOpacity>
          );
        })}
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
