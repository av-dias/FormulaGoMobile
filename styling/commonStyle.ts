import { moderateScale, verticalScale } from "@/functions/responsive";
import { StatusBar } from "react-native";

const commonStyles = {
  mainPaddingHorizontal: 5,
  paddingHorizontal: moderateScale(15),
  borderRadius: 10,
  boxPaddingVertical: moderateScale(10),
  boxPaddingHorizontal: moderateScale(0),
  naviagtionBarHeight: verticalScale(110),
  symbolSize: verticalScale(8),
  smallTextSize: verticalScale(9),
  statusBarHeight: verticalScale(StatusBar.currentHeight || 0),
  onPressBounce: (
    pressed: any,
    style: any,
    onPressCallback: any,
    padding = 2
  ) => [
    {
      ...style,
      opacity: pressed ? onPressCallback && 0.8 : 1,
      paddingHorizontal: pressed ? onPressCallback && padding : null,
    },
  ],
  onBarPressBounce: (pressed: any, style: any, onPressCallback: any) => [
    {
      ...style,
      opacity: pressed ? onPressCallback && 0.8 : 1,
      paddingHorizontal: pressed ? onPressCallback && 1 : null,
    },
  ],
};

export { commonStyles };
