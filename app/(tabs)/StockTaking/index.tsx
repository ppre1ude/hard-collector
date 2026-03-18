import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// 기능 연동을 위해 필요한 라이브러리 (기존 로직 유지)
import * as FileSystem from "expo-file-system";

import styles from "./styles"; //스타일 분리 시켰어요
import { useInventorySurvey } from "./useInventorySurvey"; // 로직도 분리 시켰어요.

const { StorageAccessFramework } = FileSystem;

export default function InventorySurveyScreen() {
  const {
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
    originSurvey,
    getTodayDate,
  } = useInventorySurvey();

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (심플한 화이트 헤더) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
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
              trackColor={{ false: "#464349ff", true: "#4F7327" }}
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
        <FlatList
          data={itemsToDisplay}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
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
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
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
