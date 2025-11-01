import { Dimensions, StyleSheet } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { commonStyles } from "../../styling/commonStyle";
import { dark } from "../../utility/colors";

export const _styles = StyleSheet.create({
  page: {
    backgroundColor: dark.backgroundLight,
    //alignItems: "center",
    //justifyContent: "center",
    height: "97%",
  },
  usableScreen: {
    height:
      Dimensions.get("window").height -
      commonStyles.statusBarHeight -
      commonStyles.naviagtionBarHeight,
    backgroundColor: "transparent",
    marginTop: verticalScale(5),
    paddingHorizontal: commonStyles.paddingHorizontal,
  },
  calendarBox: {
    width: 50,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  calendarMonthContainer: {
    width: 50,
    height: 16,
    borderRadius: 5,
    justifyContent: "center",
  },
  calendarYearContainer: {
    width: 50,
    height: 16,
    borderRadius: 5,
    justifyContent: "center",
  },
  primaryText: { color: dark.textPrimary, textAlign: "center", fontSize: 12 },
  primaryTextDates: {
    color: dark.textPrimary,
    textAlign: "center",
    fontWeight: "bold",
  },
});
