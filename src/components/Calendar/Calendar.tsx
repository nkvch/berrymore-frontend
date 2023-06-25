import { ArrowBack, DateRange, Event } from '@mui/icons-material';
import { Button, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { add, addDays, eachDayOfInterval, eachWeekOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameWeek, startOfMonth } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Day, DayHeader, Month, MonthHeader, SelectionModeWrapper, Week } from './elements';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export type HiglightDatesMap = Record<string, {
  render?: (data: any) => React.ReactNode;
  data?: any;
}>;

interface CalendarProps {
  onSelectPeriod: (start: Date, end: Date) => void;
  onChangeMonth: (firstWeek: Date, lastWeek: Date, firstDay: Date, lastDay: Date) => void;
  highlightPeriods?: { start: Date, end: Date, render?: (data: any) => React.ReactNode }[];
  highlightDates?: HiglightDatesMap;
}

const Calendar = ({
  onSelectPeriod,
  onChangeMonth,
  highlightPeriods,
  highlightDates,
}: CalendarProps) => {
  const currentDate = new Date();

  const [selectionMode, setSelectionMode] = useState<'one-day' | 'period'>('one-day');

  const [selectDateStart, setSelectDateStart] = useState<Date | null>(null);
  const [selectDateEnd, setSelectDateEnd] = useState<Date | null>(null);

  const [isPseudoElementHovered, setIsPseudoElementHovered] = useState(false);

  const [preSelectDateStart, setPreSelectDateStart] = useState<Date | null>(null);
  const [preSelectDateEnd, setPreSelectDateEnd] = useState<Date | null>(null);

  const [firstDayOfMonth, setFirstDayOfMonth] = useState(startOfMonth(currentDate));

  const lastDayOfMonth = useMemo(() => endOfMonth(firstDayOfMonth), [firstDayOfMonth]);

  const weeksInMonth = useMemo(() => eachWeekOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  }), [firstDayOfMonth, lastDayOfMonth]);

  useEffect(() => {
    if (onChangeMonth) {
      onChangeMonth(
        weeksInMonth[0],
        endOfWeek(weeksInMonth[weeksInMonth.length - 1]),
        firstDayOfMonth,
        lastDayOfMonth
      );
    }
  }, [weeksInMonth, firstDayOfMonth, lastDayOfMonth, onChangeMonth]);

  const nextMonth = useCallback(() => {
    setFirstDayOfMonth(new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1));
  }, [firstDayOfMonth]);

  const prevMonth = useCallback(() => {
    setFirstDayOfMonth(new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() - 1, 1));
  }, [firstDayOfMonth]);

  const handleDayClick = useCallback((date: Date) => {
    if (selectionMode === 'one-day') {
      setSelectDateStart(date);
      setSelectDateEnd(date);
      setPreSelectDateStart(null);
      setPreSelectDateEnd(null);
    } else if (selectDateStart && selectDateEnd) {
      setSelectDateStart(date);
      setSelectDateEnd(null);
      setPreSelectDateStart(null);
      setPreSelectDateEnd(null);
    } else if (selectDateStart) {
      if (date < selectDateStart) {
        setSelectDateStart(date);
        setSelectDateEnd(selectDateStart);
        setPreSelectDateStart(null);
        setPreSelectDateEnd(null);
      } else {
        setSelectDateEnd(date);
        setPreSelectDateStart(null);
        setPreSelectDateEnd(null);
      }
    } else {
      setSelectDateStart(date);
      setPreSelectDateStart(null);
      setPreSelectDateEnd(null);
    }
  }, [selectDateStart, selectDateEnd]);

  const handleDayMouseEnter = useCallback((date: Date) => {
    if (selectionMode === 'period') {
      if (selectDateStart && !selectDateEnd) {
        if (date < selectDateStart) {
          setPreSelectDateStart(date);
          setPreSelectDateEnd(selectDateStart);
        } else {
          setPreSelectDateStart(selectDateStart);
          setPreSelectDateEnd(date);
        }
      }
    }
  }, [selectionMode, selectDateStart, selectDateEnd]);

  // on click outside #calendar - clear selection if only one date selected
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const calendar = document.getElementById('calendar');

    const domNode = event.target as HTMLElement;

    if (calendar && !calendar.contains(domNode) && selectDateStart && !selectDateEnd) {
      setSelectDateStart(null);
      setPreSelectDateStart(null);
      setPreSelectDateEnd(null);
    }
  }, [selectDateStart, selectDateEnd]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (selectDateStart && selectDateEnd) {
      const earlierDate = selectDateStart < selectDateEnd ? selectDateStart : selectDateEnd;
      const laterDate = selectDateStart < selectDateEnd ? selectDateEnd : selectDateStart;
      onSelectPeriod(earlierDate, laterDate);
    }
  }, [selectDateStart, selectDateEnd, onSelectPeriod]);

  useEffect(() => {
    setSelectDateStart(null);
    setSelectDateEnd(null);
    setPreSelectDateStart(null);
    setPreSelectDateEnd(null);
  }, [selectionMode]);

  const renderHighlighted = useCallback((date: Date) => {
    if (!highlightPeriods) {
      return null;
    }

    for (const period of highlightPeriods) {
      const { start, end, render, ...data } = period;

      if (date >= start && date <= end) {
        return (
          <div
            className='highlighted'
            key={start.toISOString()}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsPseudoElementHovered(true);
              setPreSelectDateStart(null);
              setPreSelectDateEnd(null);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsPseudoElementHovered(false);
            }}
          >
            {render ? render(data) : null}
          </div>
        )
      }
    }
  }, [highlightPeriods]);

  const renderHighlightedDates = useCallback((date: Date) => {
    if (!highlightDates) {
      return null;
    }

    const { render, data } = highlightDates[date.toISOString()] || {};

    if (render) {
      return (
        <div className='highlighted' key={date.toISOString()} onMouseEnter={(e) => e.stopPropagation()}>
          {render(data)}
        </div>
      )
    }
  }, [highlightDates]);

  return (
    <Grid container id="calendar" component="div">
      <MonthHeader>
        <Button onClick={prevMonth}>
          <ArrowBack />
        </Button>
        <Typography variant="h4" gutterBottom>
          {format(firstDayOfMonth, 'LLLL')}
        </Typography>
        <Button onClick={nextMonth}>
          <ArrowBack style={{ transform: 'rotate(180deg)' }} />
        </Button>
      </MonthHeader>
      <Month>
        <Week>
          {daysOfWeek.map((day) => (
            <DayHeader key={day}>
              {day}
            </DayHeader>
          ))}
        </Week>
        {weeksInMonth.map((weekStartDate) => (
          <Week key={weekStartDate.toISOString()}>
            {eachDayOfInterval({
              // from monday to sunday
              start: new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + 1),
              end: new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + 7),
            }).map((date) => (
              <Day
                key={date.toISOString()}
                className={`
                  ${isPseudoElementHovered ? 'is-pseudo-element-hovered' : ''}
                  ${isSameWeek(date, currentDate) ? 'is-current-week' : ''}
                  ${isSameDay(date, currentDate) ? 'is-today' : ''}
                  ${selectDateEnd && selectDateStart && date >= selectDateStart && date <= selectDateEnd ? 'is-selected' : ''}
                  ${preSelectDateStart && preSelectDateEnd && date >= preSelectDateStart && date <= preSelectDateEnd ? 'is-pre-selected' : ''}
                  ${date.getMonth() !== firstDayOfMonth.getMonth() ? 'not-in-month' : ''}
                `}
                onClick={() => date.getMonth() === firstDayOfMonth.getMonth() ? handleDayClick(date) : {}}
                onMouseEnter={() => date.getMonth() === firstDayOfMonth.getMonth() ? handleDayMouseEnter(date) : {}}
              >
                {format(date, 'd')}
                {/* {renderHighlighted(date)} */}
                {renderHighlightedDates(date)}
              </Day>
            ))}
          </Week>
        ))}
      </Month>
      <SelectionModeWrapper>
        <Typography variant="body1" gutterBottom>
          Режим выбора даты
        </Typography>
        <ToggleButtonGroup
          value={selectionMode}
          exclusive
          defaultValue={'one-day'}
          onChange={(_, value) => setSelectionMode(value || 'one-day')}
        >
          <ToggleButton value="one-day">
            <Event /> Один день
          </ToggleButton>
          <ToggleButton value="period">
            <DateRange /> Период
          </ToggleButton>
        </ToggleButtonGroup>
      </SelectionModeWrapper>
    </Grid>
  );
};

export default Calendar;
