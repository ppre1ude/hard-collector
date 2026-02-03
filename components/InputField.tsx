import { colors } from "@/constants";
import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  variant?: "filled" | "standard" | "outline";
}

function InputField({ label, variant = "filled", ...props }: InputFieldProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, styles[variant]]}>
        <TextInput style={styles.input} {...props}></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: colors.GRAY_700,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 44,
    borderRadius: 8,
  },
  filled: {
    backgroundColor: colors.GRAY_100,
  },
  standard: {},
  outline: {},
  input: {
    fontSize: 14,
    padding: 0,
    flex: 1,
  },
});

export default InputField;
