import React, { useRef, useState } from 'react';
import { format, isSameDay, isSameWeek } from 'date-fns';
import { DayElement, RelativeContainer } from './elements';
import { Menu, MenuItem } from '@mui/material';

type DayProps = {
  date: Date;
  currentDate: Date;
  selectDateStart: Date | null;
  selectDateEnd: Date | null;
  preSelectDateStart: Date | null;
  preSelectDateEnd: Date | null;
  isPseudoElementHovered?: boolean;
  makePeriod: (date: Date) => void;
  makeOneDayPeriod: (date: Date) => void;
  handleDayMouseEnter: (date: Date) => void;
  children?: React.ReactNode;
};

const Day: React.FC<DayProps> = ({
  date,
  currentDate,
  selectDateStart,
  selectDateEnd,
  preSelectDateStart,
  preSelectDateEnd,
  isPseudoElementHovered,
  makePeriod,
  makeOneDayPeriod:
  handleDayMouseEnter,
  children,
}) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const dayRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <DayElement
        ref={dayRef}
        className={`
        ${isPseudoElementHovered ? 'is-pseudo-element-hovered' : ''}
        ${isSameWeek(date, currentDate) ? 'is-current-week' : ''}
        ${isSameDay(date, currentDate) ? 'is-today' : ''}
        ${selectDateEnd && selectDateStart && date >= selectDateStart && date <= selectDateEnd ? 'is-selected' : ''}
        ${preSelectDateStart && preSelectDateEnd && date >= preSelectDateStart && date <= preSelectDateEnd ? 'is-pre-selected' : ''}
        ${date.getMonth() !== firstDayOfMonth.getMonth() ? 'not-in-month' : ''}
      `}
        onClick={() => setAnchorEl(dayRef.current)}
      // onMouseEnter={() => date.getMonth() === firstDayOfMonth.getMonth() ? handleDayMouseEnter(date) : {}}
      >
        {format(date, 'd')}
        {children}
      </DayElement>
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <MenuItem>
          Смена в этот день
        </MenuItem>
        <MenuItem>
          Начало смены
      </Menu>
    </>
  );
};

export default Day;
