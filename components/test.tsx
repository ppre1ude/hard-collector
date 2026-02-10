interface Item_list {
  index: number | string;
  name: string;
  count: number | string;
  variant?: "default" | "Edit"; // 추가된 variant prop
}
