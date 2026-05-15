import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TemplateSelector } from "../components/TemplateSelector";
import { useTemplates } from "../store/TemplateContext";
import { Template } from "../types/template";

export default function TemplateBrowseScreen() {
  const router = useRouter();
  const { templates } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleStart = () => {
    if (!selectedTemplate) return;
    router.push({
      pathname: "/StockTaking",
      params: { template: JSON.stringify(selectedTemplate) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#4F7327" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>템플릿 둘러보기</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>맞춤형 작업 환경</Text>
          <Text style={styles.description}>
            상황에 맞는 템플릿을 선택하여 모바일 입력 화면을 더욱 간편하게 만들어보세요.
          </Text>
        </View>

        <View style={styles.selectorContainer}>
          <TemplateSelector onSelect={(template) => setSelectedTemplate(template)} />
        </View>

        {selectedTemplate && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>이 템플릿에 포함된 항목</Text>
            <View style={styles.fieldList}>
              <View style={styles.fieldItem}>
                <Ionicons name="barcode-outline" size={20} color="#666" />
                <Text style={styles.fieldText}>바코드 <Text style={styles.defaultBadge}>(기본)</Text></Text>
              </View>
              {selectedTemplate.fields.map((field) => (
                <View key={field.id} style={styles.fieldItem}>
                  <Ionicons 
                    name={field.type === 'select' ? "list" : field.type === 'boolean' ? "checkmark-circle-outline" : "document-text-outline"} 
                    size={20} 
                    color="#4F7327" 
                  />
                  <Text style={styles.fieldText}>
                    {field.displayName} 
                    <Text style={styles.typeText}> ({field.type === 'select' ? '드롭다운' : field.type === 'boolean' ? '스위치' : '텍스트입력'})</Text>
                    {field.required && <Text style={styles.requiredMark}> *</Text>}
                  </Text>
                </View>
              ))}
              <View style={styles.fieldItem}>
                <Ionicons name="calculator-outline" size={20} color="#666" />
                <Text style={styles.fieldText}>수량 <Text style={styles.defaultBadge}>(기본)</Text></Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, !selectedTemplate && styles.startButtonDisabled]}
          onPress={handleStart}
          disabled={!selectedTemplate}
        >
          <Text style={styles.startButtonText}>선택한 템플릿으로 시작</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBF5",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F7327",
  },
  backButton: {
    padding: 5,
    marginLeft: -5,
  },
  content: {
    paddingBottom: 40,
  },
  introBox: {
    padding: 25,
    backgroundColor: "white",
    marginBottom: 10,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  selectorContainer: {
    paddingVertical: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },
  previewContainer: {
    padding: 20,
    backgroundColor: "white",
    marginHorizontal: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 10,
  },
  fieldList: {
    gap: 12,
  },
  fieldItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  fieldText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  typeText: {
    fontSize: 13,
    color: "#888",
  },
  requiredMark: {
    color: "red",
    fontWeight: "bold",
  },
  defaultBadge: {
    fontSize: 12,
    color: "#aaa",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },
  startButton: {
    backgroundColor: "#4F7327",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonDisabled: {
    backgroundColor: "#B5D1A0",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
