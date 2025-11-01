import { StyleSheet } from "react-native";
import { commonStyles } from "../../styling/commonStyle";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  card: {
    backgroundColor: dark.complementary,
    borderRadius: commonStyles.borderRadius,
    justifyContent: "center",
  },
});
