import { CarrosselItemsType } from "@/components/carrossel/carrossel";
import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { verticalScale } from "../functions/responsive";

export const findIcon = (iconName: string, iconSize = 25, color: string) => {
  return icons(iconSize, color).find((category) => category.label === iconName)
    ?.icon;
};

export const icons = (iconSize = 25, color: string): CarrosselItemsType[] => {
  iconSize = verticalScale(iconSize);

  return [
    {
      label: "Air",
      icon: (
        <FontAwesome6 name="temperature-low" size={iconSize} color="black" />
      ),
      color: "",
      isLabelVisible: false,
    },
    {
      label: "Humidity",
      icon: (
        <FontAwesome5 name="hand-holding-water" size={iconSize} color="black" />
      ),
      color: "",
      isLabelVisible: false,
    },
    {
      label: "Pressure",
      icon: <MaterialIcons name="compress" size={iconSize} color="black" />,
      color: "",
      isLabelVisible: false,
    },
    {
      label: "Rain",
      icon: <Fontisto name="rain" size={iconSize} color="black" />,
      color: "",
      isLabelVisible: false,
    },
    {
      label: "Temperature",
      icon: (
        <MaterialCommunityIcons
          name="go-kart-track"
          size={iconSize}
          color="black"
        />
      ),
      color: "",
      isLabelVisible: false,
    },
    {
      label: "Wind Direction",
      icon: <Feather name="wind" size={iconSize} color="black" />,
      color: "",
      isLabelVisible: false,
    },
    {
      label: "Wind Speed",
      icon: (
        <MaterialCommunityIcons name="windsock" size={iconSize} color="black" />
      ),
      color: "",
      isLabelVisible: false,
    },
  ];
};
