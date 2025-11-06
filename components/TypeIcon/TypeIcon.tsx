import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { verticalScale } from "../../functions/responsive";

export const _styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: verticalScale(10),
    justifyContent: "center",
    alignContent: "center",
    alignItems: "stretch",
    padding: 2,
    aspectRatio: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: verticalScale(8),
  },
});
``;
type TypeIconProps = {
  icon: any;
  customStyle?: ViewStyle;
};

export const TypeIcon = ({ icon, customStyle }: TypeIconProps) => {
  const styles = _styles;
  return (
    <View style={{ ...styles.container, ...customStyle }}>
      <View
        style={{ ...styles.innerContainer, backgroundColor: icon.borderColor }}
      >
        {icon.icon}
      </View>
    </View>
  );
};
