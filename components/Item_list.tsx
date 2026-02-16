import React from "react";
import { Text, View } from "react-native";

import { styles } from "./Item_list.styles";

interface ItemListProps {
  index: number | string;
  name: string;
  count: number | string;
}

export default function Item_list({ index, name, count }: ItemListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.indexText}>{index}</Text>
      <Text style={styles.nameText}>{name}</Text>
      <View style={styles.rightContainer}>
        <Text style={styles.countText}>
          {count} <Text style={styles.fixedUnit}>개</Text>
        </Text>
      </View>
    </View>
  );
}
