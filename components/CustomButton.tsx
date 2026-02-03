import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  PressableProps,
} from "react-native";
import { colors } from "@/constants";

interface CustomButtonProps extends PressableProps {
  label: String;
  size?: "medium" | "large";
  variant?: "filled" | "empty";
}

function CustomButton({
  label,
  size = "large",
  variant = "filled",
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.voteButton,
        styles[size],
        styles[variant],
        pressed && styles.pressed,
      ]}
      {...props}
    >
      <Text style={styles[variant]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  voteButton: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  large: {
    width: "100%",
    height: 44,
  },
  medium: {},
  filled: {
    backgroundColor: colors.ORANGE_600,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  pressed: {
    opacity: 0.8,
  },
  empty: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.ORANGE_600,
    color: colors.ORANGE_600,
  },
});

export default CustomButton;
