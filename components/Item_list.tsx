import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Props 타입 정의 (TypeScript 사용 시)
interface ScanItemRowProps {
  index: number | string;
  name: string;
  count: number | string;
}

export default function ScanItemRow({ index, name, count }: ScanItemRowProps) {
  return (
    <View style={styles.container}>
      {/* 1. 순번 (Prop) */}
      <Text style={styles.indexText}>{index}</Text>

      {/* 2. 항목 이름 (Prop) */}
      <Text style={styles.nameText}>{name}</Text>

      {/* 3. 수량 (Prop) + '개' (고정 텍스트) */}
      <View style={styles.rightContainer}>
        <Text style={styles.countText}>
          {count} <Text style={styles.fixedUnit}>개</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // 가로 배치
    alignItems: "center", // 세로 중앙 정렬
    justifyContent: "space-between", // 좌우 끝으로 배치
    backgroundColor: "#F9F9F9", // 스크린샷과 유사한 연회색 배경
    paddingVertical: 15, // 상하 여백
    paddingHorizontal: 20, // 좌우 여백
    marginBottom: 1, // 리스트 간 구분선 효과 (선택사항)
  },
  indexText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    width: 30, // 순번 영역 너비 고정 (정렬 유지를 위해)
  },
  nameText: {
    fontSize: 16,
    color: "#000",
    flex: 1, // 중간 영역을 꽉 채우도록 설정
    textAlign: "center", // 가운데 정렬
  },
  rightContainer: {
    width: 60, // 우측 영역 너비 고정 (우측 정렬을 위해)
    alignItems: "flex-end", // 텍스트 우측 정렬
  },
  countText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  fixedUnit: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400", // 숫자는 굵게, 단위는 보통으로 (취향껏 조절)
  },
});
