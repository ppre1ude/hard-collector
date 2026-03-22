import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { CustomFieldDef } from '../types/template';

interface Props {
  fields: CustomFieldDef[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const DynamicForm: React.FC<Props> = ({ fields, values, onChange }) => {
  // A simple implementation of drop-down for 'select' type without bringing heavy dependencies
  // In a real app, you might want to use @react-native-picker/picker or a modal library.
  const [activeSelect, setActiveSelect] = useState<string | null>(null);

  const renderField = (field: CustomFieldDef) => {
    const value = values[field.key] ?? '';

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextInput
            style={styles.input}
            value={String(value)}
            onChangeText={(text) => onChange(field.key, text)}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            placeholder={`${field.displayName} 입력`}
          />
        );

      case 'boolean':
        return (
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {value ? '예(O)' : '아니오(X)'}
            </Text>
            <Switch
              value={!!value}
              onValueChange={(val) => onChange(field.key, val)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={value ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        );

      case 'select': {
        const isExpanded = activeSelect === field.key;
        return (
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={styles.selectTrigger}
              onPress={() => setActiveSelect(isExpanded ? null : field.key)}
            >
              <Text style={value ? styles.selectText : styles.placeholder}>
                {value || `${field.displayName} 선택`}
              </Text>
              <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded && field.options && (
              <View style={styles.optionsList}>
                {field.options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.optionItem}
                    onPress={() => {
                      onChange(field.key, option);
                      setActiveSelect(null);
                    }}
                  >
                    <Text style={value === option ? styles.selectedOptionText : styles.optionText}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      }

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <View key={field.id} style={styles.fieldWrapper}>
          <Text style={styles.label}>
            {field.displayName}
            {field.required && <Text style={styles.requiredAsterisk}> *</Text>}
          </Text>
          {renderField(field)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: '#ff3b30',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  selectContainer: {
    position: 'relative',
    zIndex: 1,
  },
  selectTrigger: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  selectText: {
    color: '#333',
    fontSize: 16,
  },
  chevron: {
    color: '#666',
    fontSize: 12,
  },
  optionsList: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
