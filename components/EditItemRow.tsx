import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { styles } from "./EditItemRow.styles";

const DRAG_SCALE_INPUT_MAX = 80;

interface SwipeableLeftActionsProps {
  drag: SharedValue<number>;
  onDelete: () => void;
}

function SwipeableLeftActions({ drag, onDelete }: SwipeableLeftActionsProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      drag.value,
      [0, DRAG_SCALE_INPUT_MAX],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }] };
  });

  return (
    <TouchableOpacity
      onPress={onDelete}
      style={styles.deleteButton}
      activeOpacity={0.8}
    >
      <Reanimated.Text style={[styles.deleteText, animatedStyle]}>
        삭제
      </Reanimated.Text>
    </TouchableOpacity>
  );
}

interface EditItemRowProps {
  index: number;
  name: string;
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
}

export default function EditItemRow({
  index,
  name,
  count,
  onIncrease,
  onDecrease,
  onDelete,
}: EditItemRowProps) {
  const renderLeftActions = (_progress: SharedValue<number>, drag: SharedValue<number>) => (
    <SwipeableLeftActions drag={drag} onDelete={onDelete} />
  );

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={40}
      renderLeftActions={renderLeftActions}
      containerStyle={{ width: "100%", backgroundColor: "white" }}
    >
      <View style={styles.container}>
        <Text style={styles.indexText}>{index}</Text>
        <Text style={styles.nameText} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={onDecrease}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.countText}>{count} 개</Text>
          <TouchableOpacity style={styles.circleButton} onPress={onIncrease}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}
