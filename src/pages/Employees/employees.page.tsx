import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePaginatedQuery from "../../api/hooks/usePaginatedQuery";
import getForemen, { ForemanTableItem } from "../../api/queryFns/foremen.query";
import ConfirmModal from "../../components/common/Modal/variants/ConfirmModal/ConfirmModal";
import authorized from "../../helpers/withAuth";
import { AddButton } from "./elements";
import useAuthenticatedMutation from "../../api/auth/hooks/useAuthenticatedMutation";
import deleteForemanMutationFn, { DeleteForemanMutationVariables } from "../../api/mutationFns/deleteforeman.mutation";
import { notification } from "../../components/Notifications/Notifications";
import { useInfiniteQuery } from "@tanstack/react-query";
import getEmployees, { EmployeeTableItem } from "../../api/queryFns/employees.query";
import deleteEmployeeMutationFn, { DeleteEmployeeMutationVariables } from "../../api/mutationFns/employees/delete-employee.mutation";


function EmployeesPage() {
  const navigate = useNavigate();

  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeTableItem | null>(null);

  const [search, setSearch] = useState('');

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    refetch,
  } = useInfiniteQuery(
    ['employees'],
    ({ pageParam = 0 }) => getEmployees({ search }, { page: pageParam, perPage: 10 }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
      },
      getPreviousPageParam: (firstPage, pages) => {
        if (firstPage.currentPage > 1) {
          return firstPage.currentPage - 1;
        }
      }
    }
  );

  const {
    mutate: deleteEmployeeMutation,
    isLoading: isDeleting,
  } = useAuthenticatedMutation<unknown, Error, DeleteEmployeeMutationVariables>({
    mutationKey: ['deleteEmployee', deletingEmployee?.id],
    mutationFn: deleteEmployeeMutationFn,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: `Сборщик ${deletingEmployee?.firstName} ${deletingEmployee?.lastName} успешно удален`,
      });
      setDeletingEmployee(null);
      refetch();
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении сборщика',
        text: error.message,
      });
    }
  })

  const columns: GridColDef<EmployeeTableItem>[] = useMemo(() => ([
    {
      field: 'fullName',
      headerName: 'Имя и фамилия',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'foreman',
      headerName: 'Бригадир',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.foreman?.firstName || ''} ${params.row.foreman?.lastName || ''}`,
    },
    {
      field: 'actions',
      headerName: 'Действия',
      sortable: false,
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <IconButton
              onClick={() => {
                navigate(`/employees/${params.row.id}`);
              }}
              title="Редактировать"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setDeletingEmployee(params.row);
              }}
              title="Удалить"
            >
              <Delete />
            </IconButton>
          </>
        );
      }
    }
  ]), []);

  return (
    <>
      <ConfirmModal
        open={!!deletingEmployee}
        onCancel={() => setDeletingEmployee(null)}
        onConfirm={() => {
          if (deletingEmployee) {
            deleteEmployeeMutation({
              id: deletingEmployee.id,
            });
          }
        }}
        loading={isDeleting}
        title="Удаление сборщика"
        text={`Вы действительно хотите удалить сборщика ${deletingEmployee?.firstName} ${deletingEmployee?.lastName}? Данное действие нельзя отменить.`}
      />
      <DataGrid
        columns={columns}
        rows={data?.pages.flatMap((page) => page.items) || []}
        loading={isFetching}
        pageSizeOptions={[
          10, 25
        ]}
        pagination
        paginationMode='server'
        checkboxSelection={true}
        onRowSelectionModelChange={(params) => {
          console.log(params);
        }}
      />
      <AddButton
        onClick={() => navigate('/employees/create')}
      >
        Добавить
      </AddButton>
    </>
  );
}

export default authorized(EmployeesPage);
