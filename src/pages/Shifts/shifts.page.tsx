import { Avatar } from "@mui/material";
import { eachDayOfInterval } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenticatedMutation from "../../api/auth/hooks/useAuthenticatedMutation";
import useAuthenticatedQuery from "../../api/auth/hooks/useAuthenticatedQuery";
import addShift, { AddShiftMutationDto } from "../../api/mutationFns/shifts/add-shift.mutation";
import getEmployees from "../../api/queryFns/employees.query";
import getShifts, { Shift } from "../../api/queryFns/shifts.query";
import Calendar, { HiglightDatesMap } from "../../components/Calendar/Calendar";
import { notification } from "../../components/Notifications/Notifications";
import Form from "../../components/common/Form/Form";
import { FieldData } from "../../components/common/Form/types";
import authorized from "../../helpers/withAuth";
import { HorizontalStackAvatar } from "./elements";

const employeeFormData: FieldData[] = [
  {
    name: "employeeIds",
    label: "Выберите сотрудников",
    type: 'fetch-select',
    fetchSelectConfig: {
      backendSearch: true,
      multiple: true,
      queryFn: (search, pagParams) => getEmployees({ search }, pagParams),
      showInOption: [{
        key: 'firstName',
        type: 'text'
      }, {
        key: 'lastName',
        type: 'text'
      }],
      showInValue: [{
        key: 'firstName',
        type: 'text'
      }, {
        key: 'lastName',
        type: 'text'
      }],
      valueKey: 'id',
    }
  }
]

function Shifts() {
  const navigate = useNavigate();
  const [newShift, setNewShift] = useState<[Date, Date] | null>(null);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const {
    data: shifts,
    // isFetching,
    refetch,
  } = useAuthenticatedQuery(
    ['shifts', from, to],
    () => getShifts({ from, to }),
    {
      enabled: !!from || !!to,
    }
  )

  const highlightDates = useMemo(() => {
    if (shifts) {
      const dates: HiglightDatesMap = {};

      shifts.forEach(({ startDate, endDate, employees }) => {
        const period = eachDayOfInterval({
          start: new Date(startDate),
          end: new Date(endDate),
        });

        period.forEach((date) => {
          if (!dates[date.toISOString()]) {
            dates[date.toISOString()] = {
              data: {
                employees: [],
              },
              render: (data) => (
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    padding: '5px'
                  }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    navigate(`/shifts/day?date=${date.toISOString()}`);
                  }}
                >
                  <HorizontalStackAvatar>
                    {data.employees.slice(0, 5).map((employee: Shift['employees']) => (
                      <Avatar
                        key={employee.id}
                        src={employee.photoPath || undefined}
                        sx={{ width: 24, height: 24, marginRight: '0.5rem' }}
                      />
                    ))}
                  </HorizontalStackAvatar>
                  {data.employees.length > 5 && '...'}
                  <span style={{ marginLeft: '0.5rem' }}>
                    {data.employees.length}
                  </span>
                </div>
              ),
            }
          }
          dates[date.toISOString()]!.data.employees.push(employees);
        });
      });

      return dates;
    }
  }, [shifts]);

  const onChangeMonth = useCallback(
    (weekStart: Date, weekEnd: Date) => {
      setFrom(weekStart);
      setTo(weekEnd);
    },
    []
  );

  const onSelectPeriod = useCallback(
    (start: Date, end: Date) => {
      setNewShift([start, end]);
    },
    []
  );

  const {
    mutate: createShift,
    // isLoading: isCreatingShift,
  } = useAuthenticatedMutation({
    mutationFn: addShift,
    onSuccess: () => {
      setNewShift(null);
      notification.open({
        type: 'success',
        title: 'Смена успешно создана',
      });
      refetch();
    },
    onError: (err: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при создании смены',
        text: err.message,
      });
    }
  })

  return (
    <div>
      {/* {(isFetching || isCreatingShift) && <LoadingBox />} */}
      <Calendar
        onSelectPeriod={onSelectPeriod}
        onChangeMonth={onChangeMonth}
        highlightDates={highlightDates}
      />
      <div>
        {newShift && (
          <div className="block" style={{ marginTop: '1rem' }}>
            <h3>Добавить смену</h3>
            <h4>
              {new Date(newShift[0]).toLocaleDateString()} -{' '}
              {new Date(newShift[1]).toLocaleDateString()}
            </h4>
            <Form<{
              employeeIds: AddShiftMutationDto['employeeIds']
            }>
              fields={employeeFormData}
              onSubmit={({ employeeIds }) => {
                createShift({
                  employeeIds,
                  startDate: newShift[0],
                  endDate: newShift[1],
                })
              }}
              submitText="Сохранить"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default authorized(Shifts);
