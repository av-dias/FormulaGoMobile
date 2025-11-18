import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { fetchWithTimeout } from "@/api/fetch";
import { Text } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import { DriverType } from "@/models/DriverType";
import { F1RadioData } from "@/models/RadioType";
import { dark, pallet } from "@/utility/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";

const AudioRecord = ({ url }: { url: string }) => {
  const player = useAudioPlayer(url);

  return (
    <Pressable
      onPress={() => {
        player.play();
      }}
    >
      <MaterialIcons name="spatial-audio-off" size={24} color="black" />
    </Pressable>
  );
};

// delay.js (or just a utility function in your component file)

/**
 * Creates a delay by returning a promise that resolves after the specified time.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function TabTwoScreen() {
  const [radioData, setRadioData] = React.useState<F1RadioData[]>([]);
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

          const drivers: DriverType[] = await driverJson.json();
          setDrivers(drivers);

          for (const driver of drivers) {
            fetchWithTimeout(
              `https://api.openf1.org/v1/team_radio?session_key=9877&driver_number=${driver?.driver_number}`,
              5000
            )
              .then((response: any) => response.json())
              .then((json: F1RadioData[]) => {
                console.log(json);
                if (json && json.length > 0) {
                  setRadioData((r) => [...r, ...json]);
                }
              })
              .catch((error: any) => {});
            await delay(500);
          }
        } catch (error) {
          console.log("Error " + error);
        }
      }

      if (!drivers || drivers.length == 0) fetchData();
    }, [])
  );

  return (
    <UsableScreen>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={styles.title}>Audio Records</Text>
        {selectedDriver && (
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "lightblue",
              borderRadius: 10,
              padding: 5,
            }}
            onPress={() => setSelectedDriver(undefined)}
          >
            <Text style={{ color: "lightblue" }}>Clear Filter</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, paddingTop: 10, maxHeight: 100 }}
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
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          borderRadius: 10,
          gap: 10,
        }}
      >
        {radioData &&
          radioData.length > 0 &&
          // Get only last 10 messages
          radioData
            .sort(
              (r1, r2) =>
                new Date(r1.date).getTime() - new Date(r2.date).getTime()
            )
            .filter((d) =>
              selectedDriver
                ? d.driver_number === selectedDriver?.driver_number
                : d
            )
            .map((item, index) => (
              <View key={index} style={{ gap: 2 }}>
                <View style={{ paddingLeft: 3 }}>
                  <Text>{`${new Date(item.date).toDateString()} ${new Date(
                    item.date
                  ).toLocaleTimeString()}`}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "lightgray",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      padding: 0,
                      gap: 2,
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          drivers?.find(
                            (d) => d.driver_number == item.driver_number
                          )?.headshot_url ?? undefined,
                      }}
                      style={{ width: 40, aspectRatio: 1 }}
                    />
                    <Text style={{ color: dark.textPrimary }}>
                      {
                        drivers?.find(
                          (d) => d.driver_number == item.driver_number
                        )?.name_acronym
                      }
                    </Text>
                  </View>
                  <AudioRecord url={item.recording_url} />
                </View>
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
