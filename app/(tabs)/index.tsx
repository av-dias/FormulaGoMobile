import { StyleSheet } from "react-native";

import { fetchWithTimeout } from "@/api/fetch";
import Carrossel from "@/components/carrossel/carrossel";
import { FlatCalendar } from "@/components/flatCalender/FlatCalender";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import { SessionType } from "@/models/SessionType";
import { WeatherType } from "@/models/WeatherType";
import { formatISODateToParts } from "@/utility/calendar";
import { dark, pallet } from "@/utility/colors";
import { icons } from "@/utility/icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView } from "react-native-gesture-handler";

const loadedDate = (data: any) => {
  const date = formatISODateToParts(data.date);
  return `Loaded from ${date.day || "-"} ${date.time || "-"}`;
};

const loadIcons = (data: WeatherType) => {
  return icons(10, "black").map((icon) => {
    switch (icon.label) {
      case "Air":
        icon.value = `${
          data.air_temperature != null ? data.air_temperature : "-"
        } °C`;
        break;
      case "Humidity":
        icon.value = `${data.humidity != null ? data.humidity : "-"} %`;
        break;
      case "Pressure":
        icon.value = `${data.pressure != null ? data.pressure : "-"} hPa`;
        break;
      case "Rain":
        icon.value = `${data.rainfall != null ? data.rainfall : "-"} %`;
        icon.color = Number(data.rainfall) == 0 ? "gray" : "blue";
        break;
      case "Temperature":
        icon.value = `${
          data.track_temperature != null ? data.track_temperature : "-"
        } °C`;
        break;
      case "Wind Direction":
        icon.value = `${
          data.wind_direction != null ? data.wind_direction : "-"
        } °`;
        break;
      case "Wind Speed":
        icon.value = `${data.wind_speed != null ? data.wind_speed : "-"} km/h`;
        break;

      default:
        icon.value = "";
    }
    return icon;
  });
};

export default function TabOneScreen() {
  const [weather, setWeather] = React.useState<WeatherType>({} as WeatherType);
  const [latestUpdate, setLatestUpdate] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<Date>(new Date());
  const [sessions, setSessions] = React.useState<SessionType[] | null>(null);
  const [selectedSession, setSelectedSession] = React.useState<SessionType>(
    {} as SessionType
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        fetchWithTimeout(
          "https://api.openf1.org/v1/sessions?session_name=Race&year=2025",
          5000
        )
          .then((response: any) => response.json())
          .then((json: any) => {
            if (json && json.length > 0) {
              const sortedSessions = json.sort(
                (a: SessionType, b: SessionType) =>
                  b.date_start.localeCompare(a.date_start)
              );

              const selected = sortedSessions.find(
                (session: SessionType) =>
                  formatISODateToParts(session.date_start).day <=
                  formatISODateToParts(date.toISOString()).day
              );

              setSelectedSession(selected);
              setSessions(sortedSessions);
            }
          })
          .catch((error: any) => {
            console.error("Error fetching data:", error);
          });
      }

      fetchData();
    }, [date])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        fetchWithTimeout(
          `https://api.openf1.org/v1/weather?meeting_key=${
            selectedSession.meeting_key
          }&date<=${date.toISOString().split("T")[0]}`,
          5000
        )
          .then((response: any) => response.json())
          .then((json: WeatherType[]) => {
            if (json && json.length > 0) setWeather(json[json.length - 1]);
            else setWeather({} as WeatherType);
          })
          .catch((error: any) => {
            console.error("Error fetching data:", error);
            setWeather({} as WeatherType);
          });
        setLatestUpdate(`Last updated: ${new Date().toLocaleString()}`);
      }

      fetchData();
    }, [selectedSession])
  );

  return (
    <UsableScreen>
      <View style={{ backgroundColor: "transparent" }}>
        <Text style={styles.title}>
          {`${selectedSession?.circuit_short_name || "General"}`} Track
          Information
        </Text>
        <Text style={styles.subtitle}>{latestUpdate}</Text>
      </View>
      <FlatCalendar date={date} setInputBuyDate={setDate} />
      <View style={styles.container}>
        {weather ? (
          <View style={{ gap: 10, backgroundColor: "transparent" }}>
            <View style={{ gap: 10, backgroundColor: "transparent" }}>
              <Text style={styles.subtitle}>{loadedDate(weather)}</Text>
            </View>
            <Carrossel
              items={loadIcons(weather)}
              type={null}
              setType={() => {}}
              size={40}
              width={"100%"}
              justifyContent="space-between"
              gap={2}
            />
          </View>
        ) : (
          <View style={{ height: 40, backgroundColor: "transparent" }} />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingTop: 20,
            backgroundColor: "transparent",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          {sessions &&
            sessions.length > 0 &&
            sessions
              .sort((a, b) => b.date_start.localeCompare(a.date_start))
              .map((session) => (
                <View
                  key={session.session_key}
                  style={{
                    padding: 5,
                    aspectRatio: 1,
                    height: 100,
                    backgroundColor: dark.glass,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor:
                      formatISODateToParts(weather.date).day ===
                      formatISODateToParts(session?.date_start).day
                        ? pallet.secundary
                        : "transparent",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ backgroundColor: "transparent" }}>
                    <Text style={styles.textCenter}>
                      {session.circuit_short_name.split("-")[0]}
                    </Text>
                    <Text style={styles.textCenterSm}>
                      {session.country_name}
                    </Text>
                  </View>
                  <Text style={styles.textCenterSm}>
                    {session.date_start.split("T")[0]}
                  </Text>
                </View>
              ))}
        </ScrollView>
      </View>
    </UsableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 30,
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
  textCenter: {
    textAlign: "center",
    fontSize: 12,
  },
  textCenterSm: {
    textAlign: "center",
    fontSize: 10,
  },
});
