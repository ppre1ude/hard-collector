# components 폴더 컴포넌트 분석

`src/components` (또는 프로젝트 루트 `components`) 내 5개 파일의 역할을 정리한 문서입니다.

---

## 1. CustomButton.tsx

**역할:** 재사용 가능한 버튼 UI 컴포넌트

- **기술 스택:** React Native `Pressable`, `@/constants` 색상
- **주요 Props**
  - `label`: 버튼에 표시할 텍스트
  - `size`: `"medium"` | `"large"` (기본값 `"large"`, 전체 너비 + 높이 44)
  - `variant`: `"filled"` (주황 배경) | `"empty"` (흰 배경 + 주황 테두리)
- **동작:** `Pressable`로 감싸서 눌렀을 때 `pressed` 스타일(투명도 0.8) 적용. `PressableProps`를 상속해 `onPress` 등 네이티브 버튼 이벤트 전달 가능.
- **용도:** 폼 제출, 확인/취소 등 앱 전반의 일관된 버튼 스타일 제공.

---

## 2. InputField.tsx

**역할:** 라벨이 붙은 텍스트 입력 필드 (재사용용)

- **기술 스택:** React Native `TextInput`, `@/constants` 색상
- **주요 Props**
  - `label`: 입력 필드 위에 표시할 라벨 (선택)
  - `variant`: `"filled"` | `"standard"` | `"outline"` (기본값 `"filled"`, 연회색 배경)
  - 기타: `TextInputProps` 전부 전달 가능 (`placeholder`, `value`, `onChangeText` 등)
- **동작:** 라벨 유무에 따라 위에 텍스트를 보여 주고, `variant`에 따라 컨테이너 스타일만 변경. 실제 입력은 내부 `TextInput`이 담당.
- **용도:** 이름, 수량 등 폼 입력 필드를 통일된 스타일로 사용할 때.

---

## 3. Item_list.tsx

**역할:** 리스트 한 줄을 **읽기 전용**으로 보여 주는 행 컴포넌트

- **기술 스택:** React Native `View`, `Text`, `StyleSheet`
- **주요 Props (이름이 인터페이스와 동일한 `Item_list`)**
  - `index`: 순번 (number | string)
  - `name`: 항목 이름
  - `count`: 수량 (number | string), 화면에는 `"{count} 개"` 형태로 표시
- **레이아웃:** 가로 한 줄에 [순번 | 이름 | 수량 개] 배치. 순번/수량 영역 너비 고정, 이름은 `flex: 1`로 가운데 정렬.
- **용도:** 수정/삭제 없이 리스트를 보여 줄 때 사용 (예: 목록 화면, 요약 화면).

---

## 4. EditItemRow.tsx

**역할:** 리스트 한 줄을 **편집 가능**하게 보여 주는 행 컴포넌트 (수량 증감 + 스와이프 삭제)

- **기술 스택:** React Native `View`, `Text`, `TouchableOpacity`, `react-native-gesture-handler`의 `ReanimatedSwipeable`, `react-native-reanimated`
- **주요 Props**
  - `index`, `name`, `count`: 표시용 데이터
  - `onIncrease`, `onDecrease`: 수량 +/- 버튼 클릭 시 호출
  - `onDelete`: 스와이프 후 삭제 버튼 클릭 시 호출
- **동작**
  - 한 줄에 [순번 | 이름 | 수량 컨트롤] 배치. 수량은 `- / 숫자 개 / +` 형태의 연두색 원형 버튼으로 증감.
  - 행을 왼쪽으로 스와이프하면 빨간색 "삭제" 버튼이 노출되고, 클릭 시 `onDelete` 실행.
- **용도:** 수량 수정·항목 삭제가 필요한 편집 화면에서 각 항목 행으로 사용.

---

## 5. test.tsx

**역할:** 타입(인터페이스) 정의 전용 파일 (실제 UI 컴포넌트 아님)

- **내용:** `Item_list` 인터페이스만 export 없이 정의.
  - `index`: number | string
  - `name`: string
  - `count`: number | string
  - `variant?`: `"default"` | `"Edit"` (선택)
- **특징:** `Item_list.tsx`의 `Item_list`와 필드가 비슷하고, `variant`만 추가됨. 현재 프로젝트에서 import되는지 여부는 사용처에 따라 다름.
- **용도:** 리스트 항목 타입을 한곳에서 쓰거나, 이후 `Item_list` 컴포넌트에 variant를 붙일 때 참고용으로 둔 것으로 추정. 파일명이 `test`라 실제로는 타입만 두는 `types/` 또는 컴포넌트와 같은 폴더의 `Item_list.types.ts` 등으로 옮기는 편이 역할이 더 명확함.

---

## 요약 표

| 파일             | 역할                        | 편집/상태 변경                        |
| ---------------- | --------------------------- | ------------------------------------- |
| CustomButton.tsx | 공통 버튼 (filled/empty 등) | 사용처에서 onPress 등으로 처리        |
| InputField.tsx   | 라벨 + 텍스트 입력 필드     | 사용처에서 value/onChange 등으로 처리 |
| Item_list.tsx    | 읽기 전용 리스트 행         | 없음 (표시만)                         |
| EditItemRow.tsx  | 수량 증감·스와이프 삭제 행  | 있음 (증감/삭제 콜백)                 |
| test.tsx         | `Item_list` 타입 정의       | UI 없음                               |
