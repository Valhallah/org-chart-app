import React from "react";
import { Typography, Slider } from "@mui/material";
import {
  StyledSliderContainer
} from "./styled/styledDateSlider";

interface DateSliderProps {
    onYearChange: (year: number) => void;
    selectedYear: number;
  }

const DateSlider: React.FC<DateSliderProps> = ({ onYearChange, selectedYear }) => {
  const minYear = 2017;
  const midYear = 2018;
  const midYear2 = 2019;
  const midYear3 = 2020;
  const maxYear = 2021;

const handleYearChange = (event: Event, newValue: number | number[]) => {
    const newYear = newValue as number;
    onYearChange(newYear);
  };


  return (
    <>
      <StyledSliderContainer>
        <Typography aria-labelledby="date-slider" variant="subtitle1">Select by Year</Typography>
        <Slider
          id={'date-slider'}
          value={selectedYear}
          onChange={handleYearChange}
          min={minYear}
          max={maxYear}
          aria-label="Date Slider"
          step={1}
          valueLabelDisplay="auto"
          color={'secondary'}
          marks={[
            { value: minYear, label: String(minYear) },
            { value: midYear, label: String(midYear) },
            { value: midYear2, label: String(midYear2) },
            { value: midYear3, label: String(midYear3) },
            { value: maxYear, label: String(maxYear) },
          ]}
        />
      </StyledSliderContainer>
    </>
  );
};

export default DateSlider;
