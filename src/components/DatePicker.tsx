import React, { useState } from "react";
import { Typography } from "@mui/material";
import {
  StyledInputContainer,
  StyledDateInput,
  StyledHeader,
} from "./styled/styledDatePicker";
import DateSlider from "./DateSlider";

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  selected: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, selected }) => {
  const defaultDate = new Date("2021-12-31");
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const minDate = "2017-01-01";
  const maxDate = "2021-12-31";

  return (
    <>
      <StyledHeader align="center" variant="h1">
        Org Chart
      </StyledHeader>
      <DateSlider selectedYear={selectedDate.getFullYear()} onYearChange={handleYearChange} />
      <StyledInputContainer>
        <Typography variant="subtitle1">Select by Date</Typography>
        <StyledDateInput
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          min={minDate}
          max={maxDate}
        />
      </StyledInputContainer>
    </>
  );
};

export default DatePicker;
