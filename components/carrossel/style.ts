import { StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { commonStyles } from "../../styling/commonStyle";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  categoryScrollContainer: { backgroundColor: "transparent" },
  categoryContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    zIndex: 1000,
  },
  categoryIconContainer: {
    flex: 1,
  },
  iconLabel: {
    fontSize: verticalScale(10),
    color: dark.textPrimary,
    fontWeight: "bold",
  },
  labelContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: commonStyles.borderRadius,
    justifyContent: "center",
    height: 20,
  },
});
