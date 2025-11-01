import { pallet } from "@/utility/colors";
import { ReactNode } from "react";
import { View } from "react-native";

type PropsWithChildren = {
  children: ReactNode;
};

const UsableScreen: React.FC<PropsWithChildren> = (props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: pallet.background,
        padding: 40,
        paddingTop: 60,
        gap: 10,
      }}
    >
      {props.children}
    </View>
  );
};

export default UsableScreen;
