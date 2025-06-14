import React from "react";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

function DatePicker(props) {
  return (
    <Datetime
      renderDay={(props, currentDate, selectedDate) => {
        // Adds 0 to the days in the days view
        return <td {...props}>{"0" + currentDate.date()}</td>;
      }}
      renderMonth={(props, month, year, selectedDate) => {
        // Display the month index in the months view
        return <td {...props}>{month}</td>;
      }}
      renderYear={(props, year, selectedDate) => {
        // Just display the last 2 digits of the year in the years view
        return <td {...props}>{year % 100}</td>;
      }}
      onChange={props.onChange}
      value={props.value}
      isValidDate={(current) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return current > yesterday;
      }}
    />
  );
}

export default DatePicker;
