import * as FileSystem from "expo-file-system";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, TextInput } from "react-native";

export const useInventorySurvey = () => {
  const router = useRouter();
  const { survey: surveyParam } = useLocalSearchParams();
  const barcodeInputRef = useRef<TextInput>(null);

  // --- 상태 관리 ---
  const [isMerge, setIsMerge] = useState(true);
  const [barcodeText, setBarcodeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [originSurvey, setOriginSurvey] = useState<any>(null); //기존 데이터를 불러올 때 사용되는 useState
  const [scannedItems, setScannedItems] = useState<any[]>([]); // 스캔 아이템 리스트

  useFocusEffect(
    useCallback(() => {
      barcodeInputRef.current?.focus();
    }, []),
  );

  useEffect(() => {
    if (surveyParam) {
      const survey = JSON.parse(surveyParam as string);
      setFileName(survey.name);
      setScannedItems(survey.items);
      setOriginSurvey(survey);
    }
  }, [surveyParam]);

  const getTodayDate = () => {
    //오늘 날짜 반환 함수
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}-${hours}:${minutes}`;
  };

  const processBarcode = (barcode: string) => {
    //입력된 바코드를 ScannedItems에 추가하는 함수
    if (!barcode.trim()) return; // 빈 문자열은 무시
    const newItem = {
      id: Date.now(),
      name: barcode,
      count: 1,
    };
    setScannedItems((prevItems) => [...prevItems, newItem]); // 리스트 맨 뒤에 추가
  };

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
  };

  //병합 로직 (이름이 동잃하면 병합)
  const itemsToDisplay = useMemo(() => {
    if (!isMerge) return scannedItems;
    const mergedMap: Record<string, any> = {};
    scannedItems.forEach((item) => {
      const key = item.name;
      if (mergedMap[key]) {
        mergedMap[key].count += item.count;
      } else {
        mergedMap[key] = { ...item };
      }
    });
    return Object.values(mergedMap);
  }, [isMerge, scannedItems]);

  const totalCount = itemsToDisplay.length;

  const handleSave = async (callback?: () => void) => {
    //현재 오류 뜸 넘어가기로
    if (itemsToDisplay.length === 0) {
      Alert.alert("알림", "저장할 데이터가 없습니다.");
      return;
    }

    const filePath = `${FileSystem.documentDirectory}Hard_Terminal`;
    const surveyName = fileName || getTodayDate();

    try {
      /* 기존 데이터 읽기 */
      let existingSurveys: any[] = [];
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists) {
        try {
          const fileContent = await FileSystem.readAsStringAsync(filePath);
          if (fileContent) {
            const parsedData = JSON.parse(fileContent);
            if (Array.isArray(parsedData)) {
              existingSurveys = parsedData;
            }
          }
        } catch (parseError) {
          console.error("파일 파싱 중 오류 발생:", parseError);
          // 파싱 오류 시 빈 배열로 시작 (파일이 손상되었을 수 있음)
          existingSurveys = [];
        }
      }

      if (originSurvey && Array.isArray(existingSurveys)) {
        existingSurveys = existingSurveys.filter(
          (survey: any) => survey.id !== originSurvey.id,
        );
      }

      /* 새로운 데이터 추가 */
      const newSurvey = {
        id: originSurvey?.id || Date.now(),
        name: surveyName,
        date: new Date().toISOString(),
        items: itemsToDisplay,
      };

      if (Array.isArray(existingSurveys)) {
        existingSurveys.push(newSurvey);
      } else {
        existingSurveys = [newSurvey];
      }

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(existingSurveys, null, 2),
      );

      Alert.alert(
        "저장 완료",
        `'${surveyName}' 항목이 Hard_Terminal 파일에 저장되었습니다.`,
      );

      setFileName("");
      setScannedItems([]);

      if (callback) callback();
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "파일 저장 중 문제가 발생했습니다.");
    }
  };

  const handleBackPress = () => {
    if (scannedItems.length > 0) {
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
    //파일 내보내기 함수
    if (itemsToDisplay.length === 0) {
      Alert.alert("알림", "내보낼 데이터가 없습니다.");
      return;
    }

    try {
      let csvContent = "\uFEFF";
      let csvName = fileName === "" ? getTodayDate() : fileName;
      csvContent += `파일명, ${csvName}`;
      csvContent += `날짜(수정일), ${getTodayDate()}`;
      csvContent += "순번,항목 이름,수량";
      let index = 1;
      itemsToDisplay.forEach((item) => {
        const name = `"${item.name.replace(/"/g, '""')}"`;
        const count = item.count;
        csvContent += `${index++},${name},${count}
`;
      });

      const fileUri =
        FileSystem.cacheDirectory + `${fileName || getTodayDate()}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("알림", "이 기기에서는 공유 기능을 사용할 수 없습니다.");
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "파일 내보내기 중 문제가 발생했습니다.");
    }
  };

  return {
    isMerge,
    setIsMerge,
    barcodeText,
    setBarcodeText,
    fileName,
    setFileName,
    scannedItems,
    itemsToDisplay,
    totalCount,
    barcodeInputRef,
    handleScanAction,
    handleBarcodeChange,
    handleUndo,
    handleSave,
    handleBackPress,
    handleExport,
    getTodayDate,
    originSurvey,
  };
};
