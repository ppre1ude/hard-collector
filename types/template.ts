export type FieldType = 'text' | 'number' | 'boolean' | 'select' | 'date';

export interface CustomFieldDef {
  id: string;             // Unique identifier for the field (e.g. uuid)
  key: string;            // System internal key (e.g. 'managerName')
  displayName: string;    // Display name (e.g. '담당자')
  type: FieldType;        // Type of input
  options?: string[];     // Used only if type is 'select' (e.g. ['양호', '파손'])
  required: boolean;      // Is this field mandatory?
  aliases: string[];      // Used for CSV import mapping (e.g. ['담당 직원', '관리자'])
}

export interface Template {
  id: string;
  name: string;           // Template name (e.g. '재고 조사용 기본 템플릿')
  description?: string;   // Short description
  isDefault: boolean;     // True if provided by the app (cannot be deleted)
  fields: CustomFieldDef[];
}

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'default-basic',
    name: '기본 바코드 템플릿',
    description: '오직 바코드 번호와 수량만 수집합니다.',
    isDefault: true,
    fields: []
  },
  {
    id: 'default-inventory',
    name: '담당자 및 상태 템플릿',
    description: '담당자와 상태(양호/파손 등)를 함께 체크합니다.',
    isDefault: true,
    fields: [
      {
        id: 'field-manager',
        key: 'manager',
        displayName: '담당자',
        type: 'text',
        required: false,
        aliases: ['담당 직원', '당담자', '관리자']
      },
      {
        id: 'field-status',
        key: 'status',
        displayName: '상태',
        type: 'select',
        options: ['정상', '파손', '불량', '반품요망'],
        required: true,
        aliases: ['아이템 상태', '현재 상태']
      }
    ]
  },
  {
    id: 'default-return',
    name: '반품 검수 템플릿',
    description: '반품 사유 및 상태를 체크합니다.',
    isDefault: true,
    fields: [
      {
        id: 'field-status',
        key: 'status',
        displayName: '상태',
        type: 'select',
        options: ['정상', '파손', '스크래치', '기타'],
        required: true,
        aliases: []
      },
      {
        id: 'field-return-reason',
        key: 'returnReason',
        displayName: '반품 사유',
        type: 'text',
        required: true,
        aliases: ['사유', '이유']
      }
    ]
  },
  {
    id: 'default-asset',
    name: '상세 자산 관리 템플릿',
    description: '담당자, 구역/위치(체크박스or입력), 상세정보를 포함합니다.',
    isDefault: true,
    fields: [
      {
        id: 'field-manager',
        key: 'manager',
        displayName: '담당자',
        type: 'text',
        required: false,
        aliases: ['담당 직원', '당담자']
      },
      {
        id: 'field-location',
        key: 'location',
        displayName: '구역/위치',
        type: 'text',
        required: true,
        aliases: ['위치', '존', '구역', 'A구역', '창고1']
      },
      {
        id: 'field-size',
        key: 'size',
        displayName: '사이즈/상세',
        type: 'text',
        required: false,
        aliases: ['크기', '사이즈', '상세정보']
      },
      {
        id: 'field-remarks',
        key: 'remarks',
        displayName: '비고',
        type: 'text',
        required: false,
        aliases: ['메모', '기타특이사항']
      }
    ]
  }
];
