import { StyleSheet } from "react-native";

import { fetchWithTimeout } from "@/api/fetch";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import { SessionType } from "@/models/SessionType";
import { WeatherType } from "@/models/WeatherType";
import { dark, pallet } from "@/utility/colors";
import { icons } from "@/utility/icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

const loadPressureLabel = (pressure: number) => {
  if (pressure < 1000) return "Low";
  if (pressure >= 1000 && pressure <= 1020) return "Normal";
  if (pressure > 1020) return "High";
};

const loadTemperatureColor = (temperature: number) => {
  if (temperature < 10) return "lightblue";
  if (temperature < 18) return "#0030cfff";
  if (temperature < 20) return "lightgreen";
  if (temperature < 30) return "#c5b802ff";
  if (temperature < 40) return "orange";
  if (temperature < 50) return "#db0000ff";
  return "transparent";
};

const loadRainfallColor = (rainfall: number) => {
  if (rainfall < 20) return "transparent";
  if (rainfall < 33) return "lightgray";
  if (rainfall < 66) return "yellow";
  if (rainfall <= 100) return "red";
  return "transparent";
};

const loadIcons = (data: WeatherType) => {
  return icons(10, "black").map((icon) => {
    switch (icon.label) {
      case "Air":
        icon.value = `${
          data.air_temperature != null ? data.air_temperature : "-"
        } °C`;
        icon.color = loadTemperatureColor(Number(data.air_temperature));
        break;
      case "Humidity":
        icon.value = `${data.humidity != null ? data.humidity : "-"} %`;
        break;
      case "Pressure":
        icon.value = loadPressureLabel(data.pressure);
        break;
      case "Rain":
        icon.value = `${data.rainfall != null ? data.rainfall : "-"} %`;
        icon.color = loadRainfallColor(Number(data.rainfall));
        break;
      case "Temperature":
        icon.value = `${
          data.track_temperature != null ? data.track_temperature : "-"
        } °C`;
        icon.color = loadTemperatureColor(Number(data.track_temperature));
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
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [sessions, setSessions] = useState<SessionType[] | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const sessionInfo = await fetchWithTimeout(
            "https://api.openf1.org/v1/sessions?session_name=Race&year=2025",
            5000
          );

          if (!sessionInfo) return;

          const json: SessionType[] = await sessionInfo.json();
          if (!json) return;

          const sortedSessions = json.sort((a: SessionType, b: SessionType) =>
            b.date_start.localeCompare(a.date_start)
          );

          const sessionsWeather: SessionType[] = [];

          for (const session of sortedSessions) {
            const weatherJson = await fetchWithTimeout(
              `https://api.openf1.org/v1/weather?meeting_key=${
                session.meeting_key
              }&date<=${date.toISOString().split("T")[0]}`,
              5000
            );

            const weatherInfo: WeatherType[] = await weatherJson.json();
            session.weather = weatherInfo[weatherInfo.length - 1];

            sessionsWeather.push(session);
            setSessions(sessionsWeather);
          }

          setLatestUpdate(`Last updated: ${new Date().toLocaleString()}`);
        } catch (error) {
          console.log("Error " + error);
          setRefresh((r) => !r);
        }
      }

      fetchData();
    }, [refresh])
  );

  return (
    <UsableScreen>
      <View style={{ backgroundColor: "transparent" }}>
        <Text style={styles.title}>Track Information</Text>
        <Text style={styles.subtitle}>{latestUpdate}</Text>
      </View>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
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
              .map((session, index) => (
                <View
                  key={session.session_key}
                  style={{
                    height: 120,
                    backgroundColor: dark.glass,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: index === 0 ? pallet.primary : dark.glass,
                    gap: 15,
                    justifyContent: "center",
                  }}
                >
                  <View style={{ backgroundColor: "transparent" }}>
                    <Text style={styles.textCenter}>
                      {session.circuit_short_name.split("-")[0]}
                    </Text>
                    <Text style={styles.textCenterSm}>
                      {session.country_name} {session.date_start.split("T")[0]}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      flexDirection: "row",
                      gap: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    {session.weather &&
                      loadIcons(session.weather).map((icon) => {
                        return (
                          <View
                            key={icon.label}
                            style={{
                              flex: 1,
                              backgroundColor: "transparent",
                              justifyContent: "center",
                              gap: 5,
                            }}
                          >
                            <View
                              key={icon.label}
                              style={{
                                alignItems: "center",
                                padding: 10,
                                backgroundColor: "transparent",
                              }}
                            >
                              {icon.icon}
                            </View>
                            <Text
                              style={{
                                ...styles.textCenterSm,
                                color: icon.color,
                              }}
                            >
                              {icon.value}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
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
    color: dark.textPrimary,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  textCenter: {
    color: dark.textPrimary,
    textAlign: "center",
    fontSize: 12,
  },
  textCenterSm: {
    color: dark.textPrimary,
    textAlign: "center",
    fontSize: 10,
  },
});
