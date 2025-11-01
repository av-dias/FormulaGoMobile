import { StyleSheet } from "react-native";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import { commonStyles } from "../../styling/commonStyle";
import { pallet } from "../../utility/colors";

export const _styles = StyleSheet.create({
  hitBox: {
    justifyContent: "center",
    height: "100%",
    width: horizontalScale(30),
    maxWidth: 40,
    alignSelf: "center",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  calendarBox: {
    width: verticalScale(100),
    maxWidth: 175,
    backgroundColor: pallet.accent,
    padding: verticalScale(0),
    justifyContent: "center",
    borderRadius: commonStyles.borderRadius,
    elevation: 0,
  },
  iconCenterLeft: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  iconCenterRight: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: verticalScale(15),
    textAlign: "center",
    justifyContent: "center",
    color: pallet.primary,
  },
  rowGap: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    maxWidth: 250,
    backgroundColor: "transparent",
    alignSelf: "center",
    gap: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    alignSelf: "center",
    gap: 10,
  },
  calendarContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  calendarMonthContainer: { width: 50, borderRadius: 5, height: 20 },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
