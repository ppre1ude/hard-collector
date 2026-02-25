import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { generateCsvContent, mergeItemsByName, ScannedItem } from "../../../utils/barcodeUtils";
import { formatDateFromISO, getTodayDate } from "../../../utils/dateUtils";

const { StorageAccessFramework } = FileSystem;

export default function InventorySurveyScreen() {
  const router = useRouter();
  const { survey: surveyParam } = useLocalSearchParams();
  const barcodeInputRef = useRef<TextInput>(null);
  // --- 상태 관리 ---
  const [isMerge, setIsMerge] = useState(true); // 병합 보기 기본값
  const [barcodeText, setBarcodeText] = useState("");

  // 상단 입력값 (이미지처럼 기본값 세팅)
  const [fileName, setFileName] = useState("");
  const [originDate, setOriginDate] = useState("");
  const [originSurvey, setOriginSurvey] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 샘플 데이터 (이미지와 비슷하게 초기화)
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  useFocusEffect(
    useCallback(() => {
      // 화면이 포커스될 때 입력 필드에 포커스
      barcodeInputRef.current?.focus();
    }, []),
  );

  useEffect(() => {
    if (surveyParam) {
      const survey = JSON.parse(surveyParam as string);
      setFileName(survey.name);
      setScannedItems(survey.items);
      setOriginSurvey(survey);
      // 포맷된 날짜가 있다면 사용하고, 없으면 ISO string을 포맷팅해서 입력창에 넣기 위해
      setOriginDate(formatDateFromISO(survey.date));
    } else {
      setOriginDate(getTodayDate());
    }
    setHasUnsavedChanges(false);
  }, [surveyParam]);
  // --- 로직 함수들 (기존 기능 유지) ---
  // Core logic to process a barcode
  const processBarcode = (barcode: string) => {
    if (!barcode.trim()) {
      return;
    }
    const newItem = {
      id: Date.now(), // 바코드 번호
      name: barcode, // 임시 상품명
      count: 1,
    };
    setScannedItems((prevItems) => [...prevItems, newItem]); // 최신 항목을 아래로
    setHasUnsavedChanges(true);
  };

  // Handles scanning, clears input, and re-focuses
  const handleScanAction = () => {
    processBarcode(barcodeText);
    setBarcodeText("");
    setTimeout(() => barcodeInputRef.current?.focus(), 50);
  };

  const handleBarcodeChange = (text: string) => {
    if (text.includes("\n")) {
      const cleanedText = text.replace(/\n/g, "");
      // Only process if there's actual text before the newline
      if (cleanedText.trim()) {
        processBarcode(cleanedText);
      }
      setBarcodeText(""); // Clear after processing
      setTimeout(() => barcodeInputRef.current?.focus(), 50); // Re-focus after a short delay
    } else {
      setBarcodeText(text);
    }
  };

  const handleUndo = () => {
    if (scannedItems.length === 0) {
      Alert.alert("알림", "되돌릴 항목이 없습니다.");
      return;
    }
    setScannedItems(scannedItems.slice(0, -1));
    setHasUnsavedChanges(true);
  };

  // 병합 로직 (화면 표시용)
  const itemsToDisplay = useMemo(() => {
    if (!isMerge) return scannedItems;
    return mergeItemsByName(scannedItems);
  }, [isMerge, scannedItems]);

  const totalCount = itemsToDisplay.length;

  // 저장 및 내보내기 (기존 함수 틀 유지)
  const handleSave = async (callback?: () => void) => {
    if (itemsToDisplay.length === 0) {
      Alert.alert("알림", "저장할 데이터가 없습니다.");
      return;
    }

    if (!hasUnsavedChanges) {
      Alert.alert("알림", "변경된 내용이 없습니다.");
      if (callback) callback();
      return;
    }

    const totalScanned = scannedItems.reduce((acc, item) => acc + item.count, 0);
    const uniqueItems = itemsToDisplay.length;

    Alert.alert(
      "저장 확인",
      `총 ${totalScanned}개의 내역을 스캔했습니다.\n병합 시 저장될 항목은 ${uniqueItems}개입니다.\n현재 상태를 저장하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "저장",
          onPress: async () => {
            const filePath = `${FileSystem.documentDirectory}Hard_Terminal`;
            const surveyName = fileName || getTodayDate();
            const surveyDate = originDate || getTodayDate();

            try {
              // 1. 기존 데이터 읽기
              let existingSurveys = [];
              const fileInfo = await FileSystem.getInfoAsync(filePath);
              if (fileInfo.exists) {
                const fileContent = await FileSystem.readAsStringAsync(filePath);
                if (fileContent) {
                  existingSurveys = JSON.parse(fileContent);
                }
              }
              if (originSurvey) {
                existingSurveys = existingSurveys.filter(
                  (survey) => survey.id !== originSurvey.id,
                );
              }

              // 2. 새 조사 데이터 객체 생성
              const newSurvey = {
                id: originSurvey?.id || Date.now(),
                name: surveyName,
                date: surveyDate, // 사용자가 수정한 텍스트 반영
                items: itemsToDisplay, // 병합된 결과 저장
              };

              // 3. 새 데이터를 배열에 추가
              existingSurveys.push(newSurvey);

              // 4. 파일에 다시 쓰기 (JSON 형식, 보기 좋게)
              await FileSystem.writeAsStringAsync(
                filePath,
                JSON.stringify(existingSurveys, null, 2),
              );

              Alert.alert(
                "저장 완료",
                `'${surveyName}' 항목이 저장되었습니다.`,
              );

              // 5. 저장 후 상태 초기화
              setFileName("");
              setScannedItems([]);
              setHasUnsavedChanges(false);

              // 6. (Optional) Callback after save
              if (callback) {
                callback();
              }
            } catch (error) {
              console.error(error);
              Alert.alert("오류", "파일 저장 중 문제가 발생했습니다.");
            }
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "저장하지 않은 변경사항",
        "변경사항을 저장하고 나가시겠습니까?",
        [
          {
            text: "저장하고 나가기",
            onPress: () => handleSave(() => router.back()),
          },
          {
            text: "나가기",
            onPress: () => router.back(),
            style: "destructive",
          },
          { text: "취소", style: "cancel" },
        ],
      );
    } else {
      router.back();
    }
  };

  const handleExport = async () => {
    // 1. 데이터 확인
    if (itemsToDisplay.length === 0) {
      Alert.alert("알림", "내보낼 데이터가 없습니다.");
      return;
    }

    try {
      // 2. CSV 문자열 생성 (한글 깨짐 방지 BOM 추가)
      const csvName = fileName || getTodayDate();
      const csvContent = generateCsvContent(csvName, getTodayDate(), itemsToDisplay);

      // 3. 파일 경로 설정 (Cache 디렉토리 사용)
      const fileUri =
        FileSystem.cacheDirectory + `${csvName}.csv`;

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
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
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
              onChangeText={(text) => { setFileName(text); setHasUnsavedChanges(true); }}
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
            <TextInput
              style={styles.infoText}
              value={originDate}
              onChangeText={(text) => { setOriginDate(text); setHasUnsavedChanges(true); }}
              placeholder="날짜를 입력하세요"
            />
          </View>
        </View>

        {/* 3. Barcode Input (녹색 테두리 박스) */}
        <View style={styles.inputContainer}>
          <View style={styles.barcodeIconContainer}>
            <Ionicons name="barcode-outline" size={24} color="#888" />
          </View>
          <TextInput
            ref={barcodeInputRef}
            style={styles.mainInput}
            placeholder="바코드를 스캔하거나 입력하세요"
            placeholderTextColor="#aaa"
            value={barcodeText}
            onChangeText={handleBarcodeChange}
            onSubmitEditing={handleScanAction}
          />
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleScanAction}
          >
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
          onPress={() => handleSave()}
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
