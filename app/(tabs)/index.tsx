import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StartScreen() {
  const router = useRouter();

  const handleStart = () => {
    // 버튼을 누르면 조사 관리 화면으로 이동
    // replace를 쓰면 뒤로가기를 눌러도 다시 시작 화면으로 오지 않습니다 (일반적인 앱 방식)
    router.replace("/SurveyManagement");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 아이콘 영역 */}
        <View style={styles.iconContainer}>
          <Ionicons name="scan-circle-outline" size={100} color="#4F7327" />
        </View>

        {/* 타이틀 영역 */}
        <Text style={styles.title}>재고 관리 시스템</Text>
        <Text style={styles.subtitle}>쉽고 빠른 재고 조사</Text>

        {/* 시작 버튼 */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>시작하기</Text>
          <Ionicons
            name="arrow-forward"
            size={24}
            color="white"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 하단 저작권 표시 (선택사항) */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Hard Collector App</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: "#4F7327", // 앱 테마 색상 (진한 녹색)
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5, // 안드로이드 그림자
    shadowColor: "#4F7327", // iOS 그림자
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: "100%",
    justifyContent: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#ccc",
    fontSize: 12,
  },
});
