import styled from "@emotion/styled";
import { Card } from "@mui/material";

export const Higlighted = styled.div`
  background-color: #75808533;
  border-radius: 5px;
  display: flex;
  &:hover {
    background-color: #419dc733;
  }
`;

export const Month = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
  background-color: transparent;
`;

export const Week = styled(Card)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 5px;
`;

export const Day = styled(Card)`
width: 100%;
  aspect-ratio: 1.5;
  cursor: pointer;
  &:hover {
    // very light blue
    &:not(.is-pseudo-element-hovered) {
      background-color: #e0e0e0;
    }
  }
  &.is-today {
    // beatuiful light green border
    border: 2px solid #4caf50;
  }
  &.is-selected {
    background-color: #b3e5fc;
    &:hover {
      background-color: #b3e5fc;
    }
  }
  &.is-selected.is-today {
  }
  &.is-pre-selected {
    background-color: #b3e5fc94;
  }
  &.is-pre-selected.is-today {
  }
  &.not-in-month {
    background-color: #8888882f;
  }
  .highlighted {
    background-color: #75808533;
    border-radius: 5px;
    display: flex;
    &:hover {
      background-color: #419dc733;
    }
    @media screen and (max-width: 600px) {
      display: none;
    }
  }
`
export const DayHeader = styled(Card)`
  width: 100%;
  aspect-ratio: unset;
  text-align: center;
  font-weight: bold;
`;

export const MonthHeader = styled(Card)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 5px;
  margin-bottom: 10px;
`;

export const SelectionModeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;
