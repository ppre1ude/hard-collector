import { Stack } from "expo-router";

export default function SurveyManagementLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* ✅ 폴더 안에 있는 실제 파일 이름인 'index'를 적어야 합니다. */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
