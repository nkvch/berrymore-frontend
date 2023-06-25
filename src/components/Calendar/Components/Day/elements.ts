import styled from "@emotion/styled";
import { Card } from "@mui/material";

export const DayElement = styled(Card)`
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
  }
`;

export const RelativeContainer = styled.div`
  position: relative;
`;
