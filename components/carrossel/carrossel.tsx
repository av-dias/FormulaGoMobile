import { ReactNode } from "react";
import {
  DimensionValue,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { verticalScale } from "../../functions/responsive";
import CardWrapper from "../cardWrapper/cardWrapper";
import { TypeIcon } from "../TypeIcon/TypeIcon";
import { _styles } from "./style";
const BORDER_RADIUS = 10;

type CarrosselProps = {
  type: any;
  setType: any;
  size: any;
  iconSize?: any;
  iconBackground?: string;
  iconBorderColor?: string;
  items?: CarrosselItemsType[];
  onLongPress?: (id: any) => void;
  gap?: number;
  width?: DimensionValue;
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
};

export type CarrosselItemsType = {
  label: string;
  color: string;
  icon?: ReactNode;
  isLabelVisible?: boolean;
  value?: string | number;
};

export default function Carrossel({
  type,
  setType,
  size,
  iconSize = 30,
  items = [],
  iconBackground = "transparent",
  iconBorderColor = "transparent",
  gap = 10,
  width = 70,
  justifyContent = "center",
  onLongPress = () => {},
}: CarrosselProps) {
  const styles = _styles;

  return (
    <View
      style={{
        backgroundColor: "transparent",
        height: size,
        borderRadius: BORDER_RADIUS,
      }}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollContainer}
        contentContainerStyle={{
          gap: verticalScale(gap),
          paddingHorizontal: 0,
          justifyContent: justifyContent,
          backgroundColor: "transparent",
          width: width,
        }}
      >
        {items.map((iconComponent, index) => {
          return (
            <CardWrapper
              key={iconComponent.label || index}
              style={{
                backgroundColor:
                  type == iconComponent.label
                    ? iconComponent.color
                    : iconBackground,
                borderWidth: 1,
                borderColor: iconBorderColor,
              }}
            >
              <Pressable
                key={iconComponent.label}
                style={styles.categoryContainer}
                onPress={() => setType(iconComponent.label)}
                onLongPress={() => onLongPress(iconComponent.label)}
              >
                {iconComponent?.icon && (
                  <View style={styles.categoryIconContainer}>
                    <TypeIcon icon={iconComponent} />
                  </View>
                )}
                {iconComponent?.label &&
                  !(iconComponent.isLabelVisible === false) && (
                    <View style={styles.labelContainer}>
                      <Text style={styles.iconLabel}>
                        {iconComponent.label}
                      </Text>
                    </View>
                  )}
                {iconComponent?.value && (
                  <View style={styles.labelContainer}>
                    <Text style={{ ...styles.iconLabel, fontSize: 9 }}>
                      {iconComponent.value}
                    </Text>
                  </View>
                )}
              </Pressable>
            </CardWrapper>
          );
        })}
      </ScrollView>
    </View>
  );
}
