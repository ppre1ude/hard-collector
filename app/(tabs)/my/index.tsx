import { SafeAreaView, Text } from "react-native";
import AuthRoute from "@/components/AuthRoute";

export default function MyScreen() {
  return (
    <AuthRoute>
      <SafeAreaView>
        <Text>내정보 스크린</Text>
      </SafeAreaView>
    </AuthRoute>
  );
}
