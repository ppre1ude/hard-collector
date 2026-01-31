import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react"; // useState 추가
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SurveyManagementScreen() {
  const router = useRouter();

  const [isAllSelected, setIsAllSelected] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/*header*/}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>조사 관리</Text>
      </View>

      {/*List */}
      <View style={styles.listHeaderContainer}>
        <View style={styles.checkboxContainer}>
          {/* check box start 여기에는 체크 박스가 따로 없어서 이렇게 구현함*/}
          <TouchableOpacity
            onPress={() => setIsAllSelected(!isAllSelected)}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={[
                styles.customCheckbox,
                isAllSelected && styles.customCheckboxChecked,
              ]}
            >
              {isAllSelected && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>
          </TouchableOpacity>
          {/*check box end*/}
        </View>
        <View style={styles.columnHeader}>
          <Text style={styles.columnText}>일자</Text>
        </View>
        <View style={styles.columnHeader}>
          <Text style={styles.columnText}>파일 이름</Text>
        </View>
      </View>

      {/* 3. Main Content */}
      <View style={styles.content}>
        <Text style={styles.itemCount}>파일 항목 (0)</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>[파일 생성]</Text>
          <Text style={styles.emptyText}>
            버튼을 눌러서 파일을 생성해주세요
          </Text>
        </View>

        {/* FAB: 버튼 누르면 modal.tsx로 이동 */}
        <TouchableOpacity style={styles.fab} onPress={() => router.push("../")}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* 4. Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="save-outline" size={20} color="white" />
          <Text style={styles.bottomButtonText}> 저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Ionicons name="share-social-outline" size={20} color="white" />
          <Text style={styles.bottomButtonText}> 내보내기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#4F7327", padding: 15, alignItems: "center" },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },

  listHeaderContainer: {
    flexDirection: "row",
    backgroundColor: "#D8E9A8",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  checkboxContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ 커스텀 체크박스 스타일 (modal.tsx와 통일)
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#007AFF", // 스크린샷의 파란 테두리 반영 (원하면 #333으로 변경 가능)
    backgroundColor: "white",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  customCheckboxChecked: {
    backgroundColor: "#007AFF", // 체크 시 파란색 채움
    borderColor: "#007AFF",
  },

  columnHeader: {
    flex: 1,
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: "#ccc",
  },
  columnText: { fontWeight: "bold" },
  content: { flex: 1, padding: 10 },
  itemCount: { fontSize: 16, fontWeight: "bold", marginBottom: 20 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4F7327",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  bottomBar: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "#A4C686",
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomButtonText: { color: "white", fontWeight: "bold" },
});
