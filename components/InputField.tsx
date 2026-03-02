import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";

import { styles } from "./InputField.styles";

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

export default InputField;
