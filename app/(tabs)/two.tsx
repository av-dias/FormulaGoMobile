import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { fetchWithTimeout } from "@/api/fetch";
import LoadingIndicator from "@/components/loadingIndicator";
import { Text } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import { DriverType } from "@/models/DriverType";
import { F1RadioData } from "@/models/RadioType";
import { SessionType } from "@/models/SessionType";
import { text } from "@/styling/commonStyle";
import { dark, pallet } from "@/utility/colors";
import { delay } from "@/utility/timer";
import { MaterialIcons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";

function formatSecondsToMinutes(seconds: number) {
  const totalSeconds = Math.round(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

const AudioRecord = ({
  drivers,
  driverRadio: driver,
}: {
  drivers: DriverType[] | undefined;
  driverRadio: F1RadioData;
}) => {
  const player = useAudioPlayer(driver.recording_url);
  player.volume = 1;
  const status = useAudioPlayerStatus(player);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 0,
        paddingHorizontal: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: pallet.lightComplementary,
          width: 110,
          padding: 0,
          gap: 5,
          borderRadius: 10,
        }}
      >
        <Image
          source={{
            uri:
              drivers?.find((d) => d.driver_number == driver.driver_number)
                ?.headshot_url ?? undefined,
          }}
          style={{
            width: 60,
            aspectRatio: 1,
            padding: 0,
          }}
        />
        <View style={{ padding: 5, alignItems: "flex-end" }}>
          <Text style={[text.text, text.bold]}>
            {
              drivers?.find((d) => d.driver_number == driver.driver_number)
                ?.name_acronym
            }
          </Text>
          <Text style={{ color: dark.textPrimary, fontSize: 10 }}>
            #
            {
              drivers?.find((d) => d.driver_number == driver.driver_number)
                ?.driver_number
            }
          </Text>
          <Text style={[text.smallTextSize]}>
            {formatSecondsToMinutes(status.currentTime)}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: status.duration == 0 ? 20 : status.duration,
          flexDirection: "row",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flex: status.currentTime,
            height: 5,
            borderRadius: 20,
            backgroundColor: pallet.accent,
          }}
        />
        <View
          style={{
            flex:
              status.duration == 0 ? 20 : status.duration - status.currentTime,
            height: 5,
            borderRadius: 20,
            backgroundColor: pallet.lightComplementary,
          }}
        />
      </View>
      <Pressable
        onPress={() => {
          if (status.playing) {
            player.pause();
          } else if (!status.playing && status.currentTime < status.duration) {
            player.play();
          } else {
            player.seekTo(0);
            player.play();
          }
        }}
      >
        <MaterialIcons
          name="spatial-audio-off"
          size={24}
          color={status.playing ? "lightblue" : "gray"}
        />
      </Pressable>
    </View>
  );
};

const loadFlatListRadioData = (
  radioData: { [session: string | number]: F1RadioData[] } | undefined,
  sessionKey: number | string,
  selectedDriver: DriverType | undefined
) => {
  if (radioData && radioData[sessionKey]) {
    return radioData[sessionKey]
      ?.sort(
        (r1, r2) => new Date(r1.date).getTime() - new Date(r2.date).getTime()
      )
      .filter((d) =>
        selectedDriver ? d.driver_number === selectedDriver?.driver_number : d
      );
  } else {
    return [];
  }
};

export default function TabTwoScreen() {
  const [radioData, setRadioData] = React.useState<{
    [session: string | number]: F1RadioData[];
  }>();
  const [drivers, setDrivers] = useState<DriverType[]>();
  const [sessions, setSessions] = useState<SessionType[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverType>();
  const [sessionKey, setSessionKey] = useState<number | string>(9869);
  const [isLoading, setIsLoadding] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setIsLoadding(true);
        try {
          // Set previous date
          const date = new Date();
          date.setDate(date.getDate() - 1);

          const driverJson = await fetchWithTimeout(
            `https://api.openf1.org/v1/drivers?session_key=latest`
          );

          const drivers: DriverType[] = await driverJson.json();
          setDrivers(drivers);

          const sessionsJson = await fetchWithTimeout(
            `https://api.openf1.org/v1/sessions?session_name=Race&year=2025`
          );

          const sessionsUnsorted: SessionType[] = await sessionsJson.json();
          const sessionSorted = sessionsUnsorted.sort(
            (s1: SessionType, s2: SessionType) =>
              new Date(s2.date_start).getTime() -
              new Date(s1.date_start).getTime()
          );

          setSessions(sessionSorted);
          let listRadioData: F1RadioData[] = [];

          for (const driver of drivers) {
            fetchWithTimeout(
              `https://api.openf1.org/v1/team_radio?session_key=${sessionKey}&driver_number=${driver.driver_number}`,
              5000
            )
              .then((response: any) => response.json())
              .then((json: F1RadioData[]) => {
                if (json && json.length > 0) {
                  listRadioData = [...listRadioData, ...json];
                }
              })
              .catch((error: any) => {});
            await delay(350);
          }

          setRadioData((r) => ({ ...r, [sessionKey]: listRadioData }));
        } catch (error) {
          console.log("Error " + error);
        }
        setIsLoadding(false);
      }
      if (!drivers || !sessions || !radioData || !radioData[sessionKey])
        fetchData();
    }, [sessionKey])
  );

  return (
    <UsableScreen>
      <LoadingIndicator isLoading={isLoading} />
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
        style={{
          flex: 1,
          maxHeight: 70,
        }}
        contentContainerStyle={{ height: 70, gap: 5 }}
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
                gap: 2,
                borderRadius: 10,
                height: 70,
              }}
            >
              <Image
                source={{ uri: driver.headshot_url ?? undefined }}
                style={{ width: 40, aspectRatio: 1, marginRight: 3 }}
              />
              <Text style={{ color: dark.textPrimary }}>
                {driver.name_acronym}
              </Text>
            </Pressable>
          ))}
      </ScrollView>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, maxHeight: 40 }}
        contentContainerStyle={{ height: 30, gap: 5 }}
      >
        {sessions &&
          sessions.map((session: SessionType) => (
            <Pressable
              onPress={() => setSessionKey(session.session_key)}
              key={session.session_key}
              style={{
                backgroundColor:
                  session?.session_key == sessionKey
                    ? pallet.accent
                    : "transparent",
                alignItems: "center",
                padding: 5,
                gap: 2,
                borderRadius: 10,
                height: 30,
              }}
            >
              <Text style={{ color: dark.textPrimary }}>
                {session.circuit_short_name}
              </Text>
            </Pressable>
          ))}
      </ScrollView>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{
          borderRadius: 10,
          gap: 15,
        }}
        showsVerticalScrollIndicator={false}
        data={loadFlatListRadioData(radioData, sessionKey, selectedDriver)}
        renderItem={(sessionRadioData) => (
          <View style={{ gap: 1 }}>
            <View style={{ paddingLeft: 5 }}>
              <Text style={[text.symbolSize, text.textSecundary]}>{`${new Date(
                sessionRadioData.item.date
              ).toLocaleDateString()} ${new Date(
                sessionRadioData.item.date
              ).toLocaleTimeString()}`}</Text>
            </View>
            <AudioRecord
              drivers={drivers}
              driverRadio={sessionRadioData.item}
            />
          </View>
        )}
        keyExtractor={(item) => item.recording_url} // or a unique ID from your data
        initialNumToRender={10} // Number of items to render initially
        maxToRenderPerBatch={5} // Number of items to render in each batch
        windowSize={1} // Number of items to render outside the visible area
      />
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
    color: dark.textPrimary,
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
