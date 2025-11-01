import React, { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { verticalScale } from "../../functions/responsive";
import { DateFormat } from "../../models/basicUtils";
import { commonStyles } from "../../styling/commonStyle";
import {
  calendarDateRange,
  calendarOffset,
  calendarYearsRange,
  months,
  prevYearsRange,
  years,
} from "../../utility/calendar";
import { dark } from "../../utility/colors";
import ModalCustom from "../modal/modal";
import { _styles } from "./style";

/**
 * DateItem Shows date item on calendar date picker
 * @param value Value to show on item
 * @param handleCallback item press callback
 * @param conditionLogic condition logic to display selected item
 */
const DateItem = ({
  value,
  handleCallback,
  conditionLogic,
}: {
  value: any;
  handleCallback: any;
  conditionLogic: any;
}) => (
  <Pressable
    key={value}
    onPress={() => handleCallback()}
    style={{
      ..._styles.calendarMonthContainer,
      backgroundColor: conditionLogic ? dark.secundary : "transparent",
    }}
  >
    <Text
      style={{
        color: dark.textPrimary,
        textAlign: "center",
        fontSize: 14,
        fontWeight: conditionLogic ? "bold" : "normal",
      }}
    >
      {value}
    </Text>
  </Pressable>
);

/**
 * DatePickerScrollView for readability
 * @param refDate scrollview reference to scroll to
 * @param newValue new date value
 * @param children children components to load
 */
const DatePickerScrollView = ({
  refDate,
  newValue,
  children,
}: {
  refDate: any;
  newValue: any;
  children: any;
}) => (
  <ScrollView
    style={{ maxHeight: 20 }}
    ref={refDate}
    onContentSizeChange={() =>
      refDate.current.scrollTo({
        x: newValue * 55,
        animated: true,
      })
    }
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: 5 }}
    snapToInterval={55}
  >
    {children}
  </ScrollView>
);

export default function CalendarCard({
  monthState: [currentMonth, setCurrentMonth],
  yearState: [currentYear, setCurrentYear],
}: {
  monthState: any;
  yearState: any;
}) {
  const styles = _styles;
  const monthRef = useRef<ScrollView>(null);
  const yearRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  const deviceTodayYear = new Date().getFullYear();
  const monthOffset = currentMonth ? 12 : 1; // If we are using months we need to offset
  const ITEM_WIDTH = Math.floor(verticalScale(100));

  const [datePicker, setDatePicker] = useState(false);
  const [newMonth, setNewMonth] = useState(currentMonth);
  const [newYear, setNewYear] = useState(currentYear);
  const [dateOffset] = useState(
    (prevYearsRange - calendarOffset) * monthOffset
  );
  const [dateRange] = useState<DateFormat[]>(
    currentMonth ? calendarDateRange : calendarYearsRange
  );
  const [defaultIndex] = useState(
    dateOffset +
      (currentYear - deviceTodayYear) * monthOffset +
      (currentMonth ? currentMonth : 0)
  );

  const handleMonthClick = (index: number) => {
    if (currentMonth != null) setNewMonth(index);
  };

  const handleYearClick = (year: number) => {
    if (currentYear != null) setNewYear(year);
  };

  /**
   * HandleDate manages the carousel index by
   * calculating the deviation between the new
   * year and new month in relation with current
   */
  const handleDate = () => {
    const targetIndex = dateRange.findIndex((item) => item.year === newYear);

    if (currentMonth !== null) {
      flatListRef.current?.scrollToIndex({
        index: targetIndex + newMonth,
      });
      setCurrentMonth(newMonth);
    } else {
      flatListRef.current?.scrollToIndex({ index: targetIndex });
    }

    setCurrentYear(newYear);
    setDatePicker(false);
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <FlatList
          ref={flatListRef}
          horizontal={true}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="center"
          pagingEnabled
          decelerationRate={0.5}
          data={dateRange}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={defaultIndex}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / ITEM_WIDTH);

            if (currentMonth !== null && currentMonth !== undefined) {
              const month = dateRange[index].month;
              const year = dateRange[index].year;
              setCurrentYear(year);
              setCurrentMonth(months.findIndex((v) => v === month));
            } else {
              const year = dateRange[index].year;
              setCurrentYear(year);
            }
          }}
          renderItem={(element) => (
            <View
              style={{
                ...styles.centered,
                width: ITEM_WIDTH,
              }}
            >
              <Pressable onPress={() => setDatePicker(true)}>
                <Text style={styles.text}>{`${
                  currentMonth !== null ? element.item.month : ""
                } ${element.item.year}`}</Text>
              </Pressable>
            </View>
          )}
          style={{
            height: verticalScale(40),
            width: ITEM_WIDTH,
          }}
        />
        {datePicker && (
          <ModalCustom
            modalVisible={datePicker}
            setModalVisible={setDatePicker}
            size={6}
            hasColor={false}
          >
            <View
              style={{
                gap: 20,
                padding: 20,
                backgroundColor: dark.complementarySolid,
                borderRadius: commonStyles.borderRadius,
              }}
            >
              {currentYear != null && (
                <DatePickerScrollView refDate={yearRef} newValue={newYear}>
                  {years.map((year: number) => (
                    <DateItem
                      key={year}
                      value={year}
                      handleCallback={() => handleYearClick(year)}
                      conditionLogic={year === newYear}
                    />
                  ))}
                </DatePickerScrollView>
              )}
              {currentMonth != null && (
                <DatePickerScrollView refDate={monthRef} newValue={newMonth}>
                  {months.map((month: string, index: number) => (
                    <DateItem
                      key={month}
                      value={month}
                      handleCallback={() => handleMonthClick(index)}
                      conditionLogic={month === months[newMonth]}
                    />
                  ))}
                </DatePickerScrollView>
              )}
              <Pressable
                style={{
                  backgroundColor: dark.button,
                  borderRadius: commonStyles.borderRadius,
                }}
                onPress={handleDate}
              >
                <Text style={{ color: dark.textPrimary }}>Ok</Text>
              </Pressable>
            </View>
          </ModalCustom>
        )}
      </View>
    </View>
  );
}
