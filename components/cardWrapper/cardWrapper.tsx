import { Text, View, ViewStyle } from "react-native";
import { _styles } from "./style";

type CardWrapperProps = {
  noStyle?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
};

export default function CardWrapper({ noStyle = false, style = undefined, children }: CardWrapperProps) {
  return <View style={noStyle ? {} : { ..._styles.card, ...style }}>{children}</View>;
}
