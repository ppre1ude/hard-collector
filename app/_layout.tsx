import { useFonts } from "expo-font";
import { Stack } from "expo-router";
<<<<<<< HEAD
import "react-native-reanimated";

=======
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";



>>>>>>> ddb4294707be2160592f87e16dc590f3a65e7847
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
