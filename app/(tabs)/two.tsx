import { Image, Pressable, ScrollView, StyleSheet } from "react-native";

import { fetchWithTimeout } from "@/api/fetch";
import { ExternalLink } from "@/components/ExternalLink";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import { DriverType } from "@/models/DriverType";
import { F1RadioData } from "@/models/RadioType";
import { dark, pallet } from "@/utility/colors";
import { MaterialIcons } from "@expo/vector-icons";
//import { useAudioPlayer } from "expo-audio";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";

export default function TabTwoScreen() {
  const [data, setData] = React.useState<F1RadioData[] | null>(null);
  const [drivers, setDrivers] = useState<DriverType[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverType>();

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          // Set previous date
          const date = new Date();
          date.setDate(date.getDate() - 1);

          const driverJson = await fetchWithTimeout(
            `https://api.openf1.org/v1/drivers?session_key=latest`
          );

          const driverInfo = await driverJson.json();

          setDrivers(driverInfo);

          fetchWithTimeout(
            `https://api.openf1.org/v1/team_radio?session_key=9877&driver_number=${selectedDriver?.driver_number}`,
            5000
          )
            .then((response: any) => response.json())
            .then((json: F1RadioData[]) => {
              setData(json);
            })
            .catch((error: any) => {
              console.error("Error fetching data:", error);
              setData(null);
            });
        } catch (error) {
          console.log("Error " + error);
        }
      }

      fetchData();
    }, [selectedDriver])
  );

  return (
    <UsableScreen>
      <Text style={styles.title}>
        Audio Record {`${selectedDriver?.first_name || ""}`}
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ paddingTop: 10, maxHeight: 100 }}
        contentContainerStyle={{ height: 70, gap: 10 }}
      >
        {drivers &&
          drivers.map((driver: DriverType) => (
            <Pressable
              onPress={() => setSelectedDriver(driver)}
              key={driver.full_name}
              style={{
                backgroundColor:
                  selectedDriver?.driver_number == driver.driver_number
                    ? pallet.accent
                    : "transparent",
                alignItems: "center",
                padding: 5,
                aspectRatio: 1,
                gap: 2,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: pallet.primary,
                height: 70,
              }}
            >
              <Image
                source={{ uri: driver.headshot_url ?? undefined }}
                style={{ width: 40, aspectRatio: 1 }}
              />
              <Text style={{ color: dark.textPrimary }}>
                {driver.name_acronym}
              </Text>
            </Pressable>
          ))}
      </ScrollView>
      <ScrollView
        horizontal={false}
        contentContainerStyle={{
          borderRadius: 10,
          flex: 1,
        }}
      >
        {data &&
          data.length > 0 &&
          // Get only last 10 messages
          data.slice(-10).map((item, index) => (
            <View
              key={index}
              style={{
                marginBottom: 10,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                borderColor: "lightgray",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{`Message ${
                index + 1
              }`}</Text>
              <Text>{`Date: `}</Text>
              <Text>{`Driver Number: ${item.driver_number}`}</Text>
              <ExternalLink href={item.recording_url}>
                <Text style={{ color: "#659edbff", fontStyle: "italic" }}>
                  Listen to Radio Message
                </Text>
              </ExternalLink>
              <Pressable
              /* onPress={() => {
                  const player = useAudioPlayer(item.recording_url);
                  player.play();
                }} */
              >
                <MaterialIcons
                  name="spatial-audio-off"
                  size={24}
                  color="black"
                />
              </Pressable>
            </View>
          ))}
      </ScrollView>
    </UsableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "italic",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
