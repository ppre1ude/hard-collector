import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTemplates } from '../store/TemplateContext';
import { Template } from '../types/template';

interface Props {
  onSelect?: (template: Template) => void;
}

export const TemplateSelector: React.FC<Props> = ({ onSelect }) => {
  const { templates, activeTemplateId, setActiveTemplateId } = useTemplates();

  const handleSelect = (template: Template) => {
    setActiveTemplateId(template.id);
    if (onSelect) {
      onSelect(template);
    }
  };

  const renderItem = ({ item }: { item: Template }) => {
    const isActive = item.id === activeTemplateId;

    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.activeCard]}
        onPress={() => handleSelect(item)}
      >
        <Text style={[styles.title, isActive && styles.activeText]}>
          {item.name} {item.isDefault && <Text style={styles.badge}>기본</Text>}
        </Text>
        {item.description && (
          <Text style={[styles.description, isActive && styles.activeText]}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>사용할 템플릿 선택</Text>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  activeText: {
    color: '#fff',
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
  badge: {
    fontSize: 10,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
