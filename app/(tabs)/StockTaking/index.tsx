import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// 기능 연동을 위해 필요한 라이브러리 (기존 로직 유지)
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
const { StorageAccessFramework } = FileSystem;

export default function InventorySurveyScreen() {
  const router = useRouter();

  // --- 상태 관리 ---
  const [isMerge, setIsMerge] = useState(true); // 병합 보기 기본값
  const [barcodeText, setBarcodeText] = useState("");

  // 상단 입력값 (이미지처럼 기본값 세팅)
  const [fileName, setFileName] = useState("");

  // 샘플 데이터 (이미지와 비슷하게 초기화)
  const [scannedItems, setScannedItems] = useState([]);

  // --- 로직 함수들 (기존 기능 유지) ---
  const handleScan = () => {
    if (!barcodeText.trim()) return;
    const newItem = {
      id: Date.now(), // 바코드 번호
      name: barcodeText, // 임시 상품명
      count: 1,
    };
    setScannedItems([...scannedItems, newItem]); // 최신 항목을 아래로
    setBarcodeText("");
  };

  const handleUndo = () => {
    if (scannedItems.length === 0) {
      Alert.alert("알림", "되돌릴 항목이 없습니다.");
      return;
    }
    setScannedItems(scannedItems.slice(0, -1));
  };

  // 병합 로직 (화면 표시용)
  const itemsToDisplay = useMemo(() => {
    if (!isMerge) return scannedItems;

    // 이름 기준으로 병합
    const mergedMap = {};
    scannedItems.forEach((item) => {
      const key = item.name; // 혹은 item.code
      if (mergedMap[key]) {
        mergedMap[key].count += item.count;
      } else {
        mergedMap[key] = { ...item };
      }
    });
    return Object.values(mergedMap);
  }, [isMerge, scannedItems]);

  const totalCount = itemsToDisplay.length;
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD 형식
  };
  // 저장 및 내보내기 (기존 함수 틀 유지)
  const handleSave = () =>
    Alert.alert("저장", "Hard-collector 폴더에 저장합니다.");
  const handleExport = async () => {
    // 1. 데이터 확인
    if (itemsToDisplay.length === 0) {
      Alert.alert("알림", "내보낼 데이터가 없습니다.");
      return;
    }

    try {
      // 2. CSV 문자열 생성 (한글 깨짐 방지 BOM 추가)
      let csvContent = "\uFEFF"; // 헤더
      let csvName = (() => {
        if (fileName == "") return getTodayDate();
        else return fileName;
      })();
      csvContent += `파일명, ${csvName}\n`;
      csvContent += `날짜(수정일), ${getTodayDate()}\n\n`;
      csvContent += "순번,항목 이름,수량\n"; // 컬럼 헤더
      let index = 1;
      itemsToDisplay.forEach((item) => {
        // 데이터에 쉼표(,)가 있을 경우를 대비해 따옴표로 감쌈
        const name = `"${item.name.replace(/"/g, '""')}"`;
        const count = item.count;
        csvContent += `${index++},${name},${count}\n`;
      });

      // 3. 파일 경로 설정 (Cache 디렉토리 사용)
      const fileUri =
        FileSystem.cacheDirectory + `${fileName || getTodayDate()}.csv`;

      // 4. 파일 쓰기
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // 5. 공유 가능 여부 체크
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("알림", "이 기기에서는 공유 기능을 사용할 수 없습니다.");
        return;
      }

      // 6. 공유 실행
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "파일 내보내기 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (심플한 화이트 헤더) */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#4F7327" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>재고 조사 작업</Text>
        <View style={{ width: 28 }} />
        {/* 타이틀 중앙 정렬을 위한 빈 공간 */}
      </View>

      <View style={styles.contentContainer}>
        {/* 2. Top Info Section (파일명, 날짜) */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons
              name="document-text"
              size={20}
              color="#4F7327"
              style={styles.infoIcon}
            />
            <TextInput
              style={styles.infoText}
              value={fileName}
              onChangeText={setFileName}
              placeholder="파일명을 입력하세요"
            />
          </View>
          <View style={[styles.infoRow, { marginTop: 8 }]}>
            <Ionicons
              name="calendar"
              size={20}
              color="#4F7327"
              style={styles.infoIcon}
            />
            <View style={styles.infoText}>
              <Text>{getTodayDate()}</Text>
            </View>
          </View>
        </View>

        {/* 3. Barcode Input (녹색 테두리 박스) */}
        <View style={styles.inputContainer}>
          <View style={styles.barcodeIconContainer}>
            <Ionicons name="barcode-outline" size={24} color="#888" />
          </View>
          <TextInput
            style={styles.mainInput}
            placeholder="바코드를 스캔하거나 입력하세요"
            placeholderTextColor="#aaa"
            value={barcodeText}
            onChangeText={setBarcodeText}
            onSubmitEditing={handleScan}
          />
          <TouchableOpacity style={styles.plusButton} onPress={handleScan}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 4. Toggle & Count (병합 보기 스위치) */}
        <View style={styles.controlRow}>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: "#767577", true: "#4F7327" }}
              thumbColor={isMerge ? "#f4f3f4" : "#f4f3f4"}
              onValueChange={() => setIsMerge(!isMerge)}
              value={isMerge}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text style={styles.switchLabel}>동일 항목 병합해서 보기</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>총 {totalCount}개 항목</Text>
          </View>
        </View>

        {/* 5. List Area (카드 리스트) */}
        <ScrollView contentContainerStyle={styles.listContent}>
          {itemsToDisplay.map((item, index) => (
            <View key={index} style={styles.card}>
              {/* 왼쪽 아이콘 박스 */}
              <View style={styles.cardIconBox}>
                <Ionicons
                  name="file-tray-full-outline"
                  size={24}
                  color="#4F7327"
                />
              </View>

              {/* 중간 텍스트 */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
              </View>

              {/* 오른쪽 수량 및 수정 버튼 */}
              <View style={styles.cardRight}>
                <View style={styles.countRow}>
                  <Text style={styles.countText}>{item.count}</Text>
                  <Text style={styles.unitText}> 개</Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* 6. Bottom Navigation Bar (3개의 둥근 버튼) */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.bottomBtn, styles.bottomBtnWhite]}
          onPress={handleUndo}
        >
          <Ionicons name="refresh" size={24} color="#555" />
          <Text style={styles.bottomBtnTextGray}>되돌리기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomBtn, styles.bottomBtnGreen]}
          onPress={handleSave}
        >
          <Ionicons name="save" size={24} color="white" />
          <Text style={styles.bottomBtnTextWhite}>저장</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomBtn, styles.bottomBtnWhite]}
          onPress={handleExport}
        >
          <Ionicons name="share-outline" size={24} color="#555" />
          <Text style={styles.bottomBtnTextGray}>내보내기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
