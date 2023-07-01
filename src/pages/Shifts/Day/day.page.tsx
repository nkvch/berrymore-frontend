import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueGetterParams, ruRU } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import useAuthenticatedMutation from "../../../api/auth/hooks/useAuthenticatedMutation";
import useAuthenticatedQuery from "../../../api/auth/hooks/useAuthenticatedQuery";
import cutOutPeriod from "../../../api/mutationFns/shifts/cut-out-period.mutation";
import getShifts, { Shift } from "../../../api/queryFns/shifts.query";
import { notification } from "../../../components/Notifications/Notifications";
import ConfirmModal from "../../../components/common/Modal/variants/ConfirmModal/ConfirmModal";
import authorized from "../../../helpers/withAuth";
import useQueryParams from "../../../hooks/useQueryParams";
import { Container, DataGridLimitedHeight, DeleteButton } from "./elements";

let checkedRowsEmployeesIds: number[] = [];

function DayPage() {
  const queryParams = useQueryParams();
  const date = queryParams.get('date');


  const [employeesIdsSelectedForShiftDeletion, setEmployeesIdsSelectedForShiftDeletion] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: GridColDef<Shift>[] = useMemo(() => ([
    {
      field: 'employee',
      headerName: 'Сотрудник',
      sortable: true,
      width: 200,
      valueGetter: (params: GridValueGetterParams<Shift>) =>
        `${params.row.employees.lastName || ''} ${params.row.employees.firstName || ''}`,
    },
    {
      field: 'foreman',
      headerName: 'Бригадир',
      sortable: true,
      width: 200,
      valueGetter: (params: GridValueGetterParams<Shift>) =>
        `${params.row.employees.foreman.lastName || ''} ${params.row.employees.foreman.firstName || ''}`,
    },
    {
      field: 'actions',
      headerName: 'Действия',
      sortable: false,
      width: 160,
      renderCell: (params: GridRenderCellParams<Shift>) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setEmployeesIdsSelectedForShiftDeletion([params.row.employees.id]);
                setIsDeleteModalOpen(true);
              }}
              title="Убрать смену"
            >
              <Close />
            </IconButton>
          </>
        );
      }
    }
  ])
    , []);

  const {
    data: daysShifts,
    isFetching,
    refetch,
  } = useAuthenticatedQuery(
    ["shifts", date],
    () => getShifts({
      from: new Date(date!),
      to: new Date(date!)
    }),
    {
      enabled: typeof date === 'string' && new Date(date) instanceof Date,
    }
  )

  const {
    mutate: cutOutDay,
    isLoading: isCuttingOut
  } = useAuthenticatedMutation({
    mutationFn: cutOutPeriod,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: 'Смены успешно удалены'
      });
      refetch();
    },
    onError: (err: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении смен',
        text: err.message
      });
    }
  });

  return (
    <Container>
      <ConfirmModal
        open={isDeleteModalOpen}
        loading={isCuttingOut}
        title="Удаление смен"
        text="Вы уверены, что хотите удалить выбранные смены?"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          cutOutDay({
            startDate: new Date(date!),
            endDate: new Date(date!),
            employeeIds: employeesIdsSelectedForShiftDeletion
          });
          setIsDeleteModalOpen(false);
          setEmployeesIdsSelectedForShiftDeletion([]);
        }}
      />
      <DataGridLimitedHeight
        columns={columns as any}
        rows={daysShifts || []}
        loading={isFetching}
        checkboxSelection={true}
        onRowSelectionModelChange={(params) => {
          checkedRowsEmployeesIds = params as number[];
        }}
        localeText={
          ruRU.components.MuiDataGrid.defaultProps.localeText
        }
        getRowId={(row) => row.employees.id}
      />
      <DeleteButton
        onClick={() => {
          setEmployeesIdsSelectedForShiftDeletion(checkedRowsEmployeesIds);
          setIsDeleteModalOpen(true);
        }}
      >
        Удалить смены выбранным
      </DeleteButton>
    </Container>
  );
}

export default authorized(DayPage);
