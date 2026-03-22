import React, { createContext, useContext, useState, useEffect } from 'react';
import { Template, DEFAULT_TEMPLATES } from '../types/template';
import * as FileSystem from 'expo-file-system';

interface TemplateContextData {
  templates: Template[];
  activeTemplateId: string | null;
  setActiveTemplateId: (id: string) => void;
  addTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  getActiveTemplate: () => Template | undefined;
}

const TemplateContext = createContext<TemplateContextData | undefined>(undefined);

// A simple internal file to persist templates using expo-file-system
const TEMPLATES_FILE_PATH = `${FileSystem.documentDirectory}templates.json`;

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>('default-inventory');

  useEffect(() => {
    // Load custom templates on mount
    const loadTemplates = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(TEMPLATES_FILE_PATH);
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(TEMPLATES_FILE_PATH);
          const customTemplates: Template[] = JSON.parse(content);
          // Combine standard default templates with user custom templates
          setTemplates([...DEFAULT_TEMPLATES, ...customTemplates]);
        }
      } catch (error) {
        console.error('Failed to load custom templates', error);
      }
    };
    loadTemplates();
  }, []);

  const saveTemplates = async (newTemplates: Template[]) => {
    try {
      // Only save non-default custom templates
      const customTemplates = newTemplates.filter(t => !t.isDefault);
      await FileSystem.writeAsStringAsync(TEMPLATES_FILE_PATH, JSON.stringify(customTemplates));
    } catch (error) {
      console.error('Failed to save templates', error);
    }
  };

  const addTemplate = (template: Template) => {
    const updated = [...templates, template];
    setTemplates(updated);
    saveTemplates(updated);
  };

  const deleteTemplate = (id: string) => {
    // Cannot delete default templates
    const templateToDelete = templates.find(t => t.id === id);
    if (templateToDelete?.isDefault) return;

    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    if (activeTemplateId === id) {
      setActiveTemplateId('default-basic'); // fallback
    }
    saveTemplates(updated);
  };

  const getActiveTemplate = () => {
    return templates.find(t => t.id === activeTemplateId);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        activeTemplateId,
        setActiveTemplateId,
        addTemplate,
        deleteTemplate,
        getActiveTemplate
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};
