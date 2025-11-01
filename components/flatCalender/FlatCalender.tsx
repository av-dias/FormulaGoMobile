import { useFocusEffect } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { months, years } from "../../utility/calendar";
import { dark, pallet } from "../../utility/colors";
import { loadTimer } from "../../utility/timer";
import { _styles } from "./style";

type FlatCalendarProps = {
  setInputBuyDate: React.Dispatch<React.SetStateAction<any>>;
  date?: string | Date;
};

export const FlatCalendar = ({ setInputBuyDate, date }: FlatCalendarProps) => {
  const refMonth = useRef<ScrollView>(null);
  const refDate = useRef<ScrollView>(null);
  const refYear = useRef<ScrollView>(null);
  const timeoutRef = useRef(null);

  const [currentMonth, setCurrentMonth] = useState(
    date ? new Date(date).getMonth() : new Date().getMonth()
  );
  const [currentDate, setCurrentDate] = useState(
    date ? new Date(date).getDate() : new Date().getDate()
  );
  const [currentYear, setCurrentYear] = useState(
    date ? new Date(date).getFullYear() : new Date().getFullYear()
  );

  const [isYearVisible, setIsYearVisible] = useState(false);

  const styles = _styles;

  function getDaysOfMonthAndWeek() {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // 0 (Sunday) to 6 (Saturday)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < daysInMonth; i++) {
      const dayOfWeekIndex = (firstDayOfMonth + i) % 7;
      days.push({
        dayOfWeek: daysOfWeek[dayOfWeekIndex],
        date: i + 1,
      });
    }

    return days;
  }

  // Allows to temporarily shows the years scrollview
  const handleTimeout = () =>
    loadTimer(timeoutRef, () => setIsYearVisible(false), 2000);

  const handleMonthClick = (index: number) => {
    setCurrentMonth(index);
    setIsYearVisible(true);
    handleTimeout();
  };

  const handleYearClick = (year: number) => {
    setCurrentYear(year);
    setIsYearVisible(true);
    handleTimeout();
  };

  useFocusEffect(
    React.useCallback(() => {
      const buyDate = new Date(
        Date.UTC(currentYear, currentMonth, currentDate)
      );
      buyDate.setUTCHours(0, 0, 0, 0); // Set UTC hours, minutes, seconds, milliseconds to 0
      setInputBuyDate(buyDate);
    }, [currentDate, currentMonth, currentYear])
  );

  return (
    <View
      style={{
        gap: 10,
        paddingTop: verticalScale(20),
        height: verticalScale(100),
      }}
    >
      <ScrollView
        ref={refMonth}
        onContentSizeChange={() =>
          refMonth.current?.scrollTo({ x: currentMonth * 55, animated: true })
        }
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}
        snapToInterval={55}
      >
        {months.map((month, index) => (
          <Pressable
            key={month}
            onPress={() => handleMonthClick(index)}
            style={{
              ...styles.calendarMonthContainer,
              backgroundColor:
                month === months[currentMonth]
                  ? pallet.secundary
                  : "transparent",
            }}
          >
            <Text
              style={{
                color: dark.textPrimary,
                textAlign: "center",
                fontSize: 12,
                fontWeight: month === months[currentMonth] ? "bold" : "normal",
              }}
            >
              {month}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {isYearVisible && (
        <ScrollView
          ref={refYear}
          onContentSizeChange={() =>
            refYear.current?.scrollTo({ x: currentYear * 55, animated: true })
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 5, alignItems: "center" }}
          snapToInterval={55}
        >
          {years.map((year) => (
            <Pressable
              key={year}
              onPress={() => handleYearClick(year)}
              style={{
                ...styles.calendarYearContainer,
                height: year === currentYear ? 60 : 50,
                backgroundColor:
                  year === currentYear ? pallet.secundary : pallet.accent,
              }}
            >
              <Text
                style={{
                  color: dark.textPrimary,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: year === currentYear ? "bold" : "normal",
                }}
              >
                {year}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      {!isYearVisible && (
        <ScrollView
          ref={refDate}
          onContentSizeChange={() =>
            refDate.current?.scrollTo({
              x: (currentDate - 1) * 55,
              animated: true,
            })
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 5, alignItems: "center" }}
          snapToInterval={55}
        >
          {getDaysOfMonthAndWeek()?.map((item) => (
            <Pressable
              key={item.date}
              onPress={() => setCurrentDate(item.date)}
              style={{
                ...styles.calendarBox,
                height: item.date === currentDate ? 60 : 50,
                backgroundColor:
                  item.date === currentDate ? pallet.secundary : pallet.accent,
              }}
            >
              <Text style={styles.primaryText}>{item.dayOfWeek}</Text>
              <Text style={styles.primaryTextDates}>{item.date}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
