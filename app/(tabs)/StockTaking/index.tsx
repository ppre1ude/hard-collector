import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
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

  // 1. 체크박스 상태 (병합 여부)
  const [isMerge, setIsMerge] = useState(false);

  // 2. 바코드 입력 상태 (입력창 제어용)
  const [barcodeText, setBarcodeText] = useState("");

  // 3. 스캔 항목 데이터
  const [scannedItems, setScannedItems] = useState([]);

  // ✅ [기능 추가] 바코드 입력(스캔) 처리 함수
  const handleScan = () => {
    if (!barcodeText.trim()) return; // 빈 값이면 무시

    // 새 아이템 추가 (이름: 입력한 바코드, 수량: 1)
    const newItem = {
      id: Date.now(), // 고유 ID 생성
      name: barcodeText,
      count: 1,
    };

    // 스캔 항목 뒤에 추가
    setScannedItems([...scannedItems, newItem]);

    // 입력창 초기화
    setBarcodeText("");
  };

  //
  const item_undo = () => {
    if (scannedItems.length === 0) {
      Alert.alert("알림", "되돌릴 항목이 없습니다.");
      return;
    }
    const remainingItems = scannedItems.slice(0, -1);
    setScannedItems(remainingItems);
  };

  // ✅ 반응형 데이터 계산 (병합 로직)
  const itemsToDisplay = useMemo(() => {
    if (!isMerge) return scannedItems;

    const mergedMap: Record<
      string,
      { id: number; name: string; count: number }
    > = {};

    scannedItems.forEach((item) => {
      if (mergedMap[item.name]) {
        //기존의 항목에서 똑같은 이름이 있으면 가상 딕셔너리에서 수량 ++
        mergedMap[item.name].count += item.count;
      } else {
        mergedMap[item.name] = { ...item }; //없으면 그대로 카피
      }
    });
    return Object.values(mergedMap);
  }, [isMerge, scannedItems]);

  // 총 수량 계산
  const total_count = scannedItems.reduce((a, b) => a + b.count, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // ✅ push 대신 back 사용 (네비게이션 꼬임 방지)
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
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
          {/* 바코드 로직 */}
          <TextInput
            style={styles.inputFull}
            value={barcodeText}
            onChangeText={setBarcodeText}
            placeholder="바코드를 스캔하세요"
            onSubmitEditing={handleScan} // 엔터 키 누르면 추가
            returnKeyType="done"
          />
        </View>

        <View style={styles.rowBetween}>
          {/* 체크박스 영역 */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsMerge(!isMerge)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.customCheckbox,
                isMerge && styles.customCheckboxChecked,
              ]}
            >
              {isMerge && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>병합</Text>
          </TouchableOpacity>

          <View style={styles.totalRow}>
            <Text style={styles.label}>총계</Text>
            <Text>{total_count}</Text>
          </View>
        </View>
      </View>

      {/* 3. Scan Items Header */}
      <View style={styles.scanHeader}>
        <Text style={styles.scanTitle}>
          스캔 항목 ({itemsToDisplay.length})
        </Text>
        <Text style={styles.editButton}>수정</Text>
      </View>

      {/* 4. List Area */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.listContainer}>
          {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item, index) => (
              <Item_list
                key={isMerge ? `merged-${index}` : item.id}
                index={index + 1}
                name={item.name}
                count={item.count}
              />
            ))
          ) : (
            <View style={styles.emptyArea}>
              <View style={styles.centerMessage}>
                <Text style={styles.emptyText}>[데이터 없음]</Text>
                <Text style={styles.emptyText}>
                  바코드를 스캔하여 항목을 추가해주세요
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 5. Bottom Buttons */}
      <View style={styles.bottomBar}>
        {/* 실행 취소 함수 연결함 */}
        <TouchableOpacity style={styles.iconButton} onPress={item_undo}>
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
  header: {
    backgroundColor: "#4F7327",
    padding: 15,
    alignItems: "center", // 세로 중앙 정렬
    justifyContent: "center", // 가로 중앙 정렬 (제목을 위해)
    flexDirection: "row", // 가로 배치
    position: "relative", // 자식요소(버튼)의 절대 위치 기준점
    height: 50, // 헤더 높이 고정 (선택사항, 레이아웃 안정됨)
  },
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
  backButton: {
    position: "absolute", // 제목에 영향 주지 않고 띄우기
    left: 15, // 왼쪽 여백
    zIndex: 1, // 다른 요소보다 위에 오게 설정
  },
});
