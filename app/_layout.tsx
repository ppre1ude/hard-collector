import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useEffect } from "react";
import * as FileSystem from "expo-file-system";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const setupHardTerminalFile = async () => {
      const fileName = "Hard_Terminal";
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists) {
        console.log(
          `'${fileName}' not found. Creating a new file.`
        );
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify({}));
      } else {
        console.log(`'${fileName}' already exists.`);
      }
    };

    if (loaded) {
      setupHardTerminalFile();
    }
  }, [loaded]);

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
