export interface CustomFieldDef {
  id: string;
  key: string;
  displayName: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  fields: CustomFieldDef[];
}

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'default-inventory',
    name: '기본 재고조사',
    description: '가장 기본적인 형태의 재고조사 템플릿입니다.',
    isDefault: true,
    fields: [
      { id: 'f1', key: 'barcode', displayName: '바코드', type: 'text', required: true },
      { id: 'f2', key: 'quantity', displayName: '수량', type: 'number', required: true }
    ]
  },
  {
    id: 'default-basic',
    name: '간편 스캔',
    description: '바코드만 빠르게 스캔하는 템플릿입니다.',
    isDefault: true,
    fields: [
      { id: 'f1', key: 'barcode', displayName: '바코드', type: 'text', required: true }
    ]
  }
];
