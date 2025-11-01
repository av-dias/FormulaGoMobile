import { ScrollView, StyleSheet } from "react-native";

import { fetchWithTimeout } from "@/api/fetch";
import { ExternalLink } from "@/components/ExternalLink";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import { F1RadioData } from "@/models/RadioType";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";

export default function TabTwoScreen() {
  const [data, setData] = React.useState<F1RadioData[] | null>(null);
  const [latestUpdate, setLatestUpdate] = React.useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        // Set previous date
        const date = new Date();
        date.setDate(date.getDate() - 1);

        fetchWithTimeout(
          `https://api.openf1.org/v1/team_radio?session_key=9877&driver_number=81`,
          5000
        )
          .then((response: any) => response.json())
          .then((json: F1RadioData[]) => {
            console.log(json[json.length - 1]);
            setData(json);
          })
          .catch((error: any) => {
            console.error("Error fetching data:", error);
            setData(null);
          });

        setLatestUpdate(`Last updated: ${new Date().toLocaleString()}`);
      }

      fetchData();
    }, [])
  );

  return (
    <UsableScreen>
      <Text style={styles.title}>Oscar Audio Record</Text>
      <Text style={styles.subtitle}>{latestUpdate}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <ScrollView
        horizontal={false}
        contentContainerStyle={{
          padding: 20,
          borderRadius: 10,
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
