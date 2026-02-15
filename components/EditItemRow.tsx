import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface EditItemRowProps {
  index: number;
  name: string;
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

export default function EditItemRow({
  index,
  name,
  count,
  onIncrease,
  onDecrease,
  onDelete,
}: EditItemRowProps) {
  // ✅ 왼쪽 액션 (삭제 버튼) 렌더링
  const renderLeftActions = (progress: any, drag: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      // 왼쪽에서 오른쪽으로 드래그하면 drag.value는 0 -> 양수로 증가
      const scale = interpolate(
        drag.value,
        [0, 80], // 0에서 80px 정도 당겼을 때
        [0, 1], // 크기가 0에서 1로 커짐
        Extrapolation.CLAMP,
      );
      return { transform: [{ scale }] };
    });

    return (
      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteButton}
        activeOpacity={0.8}
      >
        <Reanimated.Text style={[styles.deleteText, animatedStyle]}>
          삭제
        </Reanimated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={40} // 왼쪽 드래그 감도
      renderLeftActions={renderLeftActions} // 왼쪽 액션 연결
      containerStyle={{ width: "100%", backgroundColor: "white" }}
    >
      <View style={styles.container}>
        {/* 1. 순번 */}
        <Text style={styles.indexText}>{index}</Text>

        {/* 2. 항목 이름 */}
        <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>

        {/* 3. 수량 조절 컨트롤 (스크린샷 디자인 반영) */}
        <View style={styles.counterContainer}>
          {/* 마이너스 버튼 (연두색) */}
          <TouchableOpacity style={styles.circleButton} onPress={onDecrease}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          {/* 수량 텍스트 */}
          <Text style={styles.countText}>{count} 개</Text>

          {/* 플러스 버튼 (연두색) */}
          <TouchableOpacity style={styles.circleButton} onPress={onIncrease}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 양끝 정렬
    backgroundColor: "#F5F5F5", // 아주 연한 회색 (리스트 배경)
    paddingVertical: 12, // 상하 여백
    paddingHorizontal: 20, // 좌우 여백
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // 구분선 색상
    height: 60,
  },
  indexText: {
    fontSize: 16,
    color: "#000",
    width: 30, // 순번 영역 고정
    fontWeight: "500",
  },
  nameText: {
    fontSize: 16,
    color: "#000",
    flex: 1, // 남은 공간 차지
    textAlign: "left", // 왼쪽 정렬
    paddingRight: 10,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 120, // 버튼 영역 최소 확보
  },
  // ✅ 스크린샷의 연두색 동그라미 버튼
  circleButton: {
    width: 28,
    height: 28,
    borderRadius: 14, // 완전한 원
    backgroundColor: "#CFE869", // 스크린샷의 연두색
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20, // 텍스트 수직 정렬 보정
  },
  countText: {
    fontSize: 15,
    fontWeight: "500",
    marginHorizontal: 8,
    color: "#000",
  },
  // ✅ 삭제 버튼 스타일 (빨간색)
  deleteButton: {
    backgroundColor: "#FF5252", // 스크린샷의 밝은 빨강
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
