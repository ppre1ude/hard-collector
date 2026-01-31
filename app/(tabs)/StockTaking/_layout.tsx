import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Item_list from "@/components/Item_list";

export default function InventorySurveyScreen() {
  const router = useRouter();
  // 체크박스 상태 관리 (true = 체크됨, false = 해제됨)
  const [isMerge, setIsMerge] = useState(false);

  // 샘플 스캔 항목 데이터 일단 가짜
  const [scannedItems, setScannedItems] = useState([
    { id: 1, name: "barcode-input", count: 10 },
    { id: 2, name: "wireless-mouse", count: 5 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
    { id: 3, name: "keyboard-mech", count: 2 },
  ]);

  const scan_count = scannedItems.length;

  const total_count = scannedItems
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>재고 조사</Text>
      </View>

      {/* 2. Input Form Area */}
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>파일</Text>
            <TextInput style={styles.input} placeholder="파일명 입력" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>일자</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
          </View>
        </View>

        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>바코드 번호</Text>
          <TextInput style={styles.inputFull} />
        </View>

        <View style={styles.rowBetween}>
          {/* ✅ 커스텀 체크박스 영역 시작 */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsMerge(!isMerge)} // 누를 때마다 상태 반전
            activeOpacity={0.8} // 터치감 효과
          >
            {/* 체크박스 모양 (네모) */}
            <View
              style={[
                styles.customCheckbox,
                isMerge && styles.customCheckboxChecked, // 체크되면 스타일 추가
              ]}
            >
              {/* 체크 되었을 때만 아이콘 보이기 */}
              {isMerge && <Ionicons name="checkmark" size={16} color="white" />}
            </View>

            <Text style={styles.checkboxLabel}>병합</Text>
          </TouchableOpacity>
          {/* 커스텀 체크박스 영역 끝 */}

          <View style={styles.totalRow}>
            <Text style={styles.label}>총계</Text>
            <Text>{total_count}</Text>
          </View>
        </View>
      </View>

      {/* 3. Scan Items Header */}
      <View style={styles.scanHeader}>
        <Text style={styles.scanTitle}>스캔 항목 ({scan_count})</Text>
        <Text style={styles.editButton}>수정</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 4. Empty Area */}
        <View style={styles.listContainer}>
          {scannedItems.length > 0 ? (
            scannedItems.map((item, index) => (
              <Item_list
                key={item.id}
                name={item.name}
                count={item.count}
                index={index + 1}
              />
            ))
          ) : (
            <View style={styles.emptyArea}>
              <View style={styles.centerMessage}>
                <Text style={styles.emptyText}>[파일 생성]</Text>
                <Text style={styles.emptyText}>
                  버튼을 눌러서 파일을 생성해주세요
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 5. Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="refresh" size={24} color="black" />
        </TouchableOpacity>
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

  formContainer: { backgroundColor: "#D8E9A8", padding: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroup: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
  },
  inputGroupFull: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  label: { fontWeight: "bold", marginRight: 10, paddingLeft: 5 },
  input: { flex: 1, padding: 5 },
  inputFull: { flex: 1, padding: 5 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ✅ 커스텀 체크박스 스타일
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  customCheckbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#007AFF", // 테두리 색상
    backgroundColor: "white", // 기본 배경 흰색
    borderRadius: 3, // 약간 둥글게 (완전 네모를 원하면 0으로)
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  customCheckboxChecked: {
    backgroundColor: "#007AFF", // 체크 시 배경색 (녹색)
    borderColor: "#007AFF",
  },
  checkboxLabel: { fontWeight: "bold", fontSize: 16 },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    width: 150,
  },
  inputSmall: { flex: 1, padding: 5 },

  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  scanTitle: { fontSize: 16, fontWeight: "bold" },
  editButton: { fontSize: 16, fontWeight: "bold" },

  emptyArea: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  wondaeButton: {
    position: "absolute",
    top: 50,
    right: 100,
    backgroundColor: "#88B04B",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  wondaeText: { color: "white", fontWeight: "bold" },
  centerMessage: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#aaa", fontSize: 14 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  iconButton: { justifyContent: "center", paddingHorizontal: 15 },
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
  listContainer: { minHeight: 300 },
});
