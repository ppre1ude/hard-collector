import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Pressable
        onPress={() => {
          router.push("/SurveyManagement");
        }}
      >
        <Text>홈스크린</Text>
      </Pressable>
      <CustomButton label="버튼" variant="empty"></CustomButton>
    </SafeAreaView>
  );
}
