import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

const Calendar = ({ markedDates, onDayPress, selectedDate }) => {
  return (
    <RNCalendar
      style={styles.calendar}
      onDayPress={onDayPress}
      markedDates={markedDates}
      theme={{
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#3498db',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#3498db',
        dayTextColor: '#2d4150',
        textDisabledColor: '#d9e1e8',
        dotColor: '#3498db',
        selectedDotColor: '#ffffff',
        arrowColor: '#3498db',
        monthTextColor: '#3498db',
        indicatorColor: '#3498db',
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16
      }}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    elevation: 4,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});

export default Calendar;