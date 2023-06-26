import { AddTask, Delete, Edit, Flag, PointOfSale, QrCode2 } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams, GridRow, GridRowId, GridRowSelectionModel, GridValueGetterParams, ruRU } from "@mui/x-data-grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenticatedMutation from "../../api/auth/hooks/useAuthenticatedMutation";
import deleteEmployeeMutationFn, { DeleteEmployeeMutationVariables } from "../../api/mutationFns/employees/delete-employee.mutation";
import getEmployees, { EmployeeTableItem } from "../../api/queryFns/employees.query";
import { notification } from "../../components/Notifications/Notifications";
import ConfirmModal from "../../components/common/Modal/variants/ConfirmModal/ConfirmModal";
import authorized from "../../helpers/withAuth";
import CalculateModal from "./components/CalculateModal/CalculateModal";
import FlagsModal from "./components/FlagsModal/FlagsModal";
import PrintModal from "./components/PrintModal/PrintModal";
import SearchToolbar from "./components/SearchToolbar/SearchToolbar";
import ShiftModal from "./components/ShiftModal/ShiftModal";
import WithFlagsBar from "./components/WithFlagsBar/WithFlagsBar";
import { AddButton, DataGridLimitedHeight, FetchMoreButton, PageActionButton, PagesInfo, PaginationWrapper } from "./elements";

let selectedEmployeesIds: GridRowSelectionModel = [];

function EmployeesPage() {
  const navigate = useNavigate();

  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeTableItem | null>(null);
  const [calculatingEmployee, setCalculatingEmployee] = useState<EmployeeTableItem | null>(null);

  const [search, setSearch] = useState('');
  const [foremanId, setForemanId] = useState<number | null>(null);
  const [flagsPresent, setFlagsPresent] = useState<number[]>([]);
  const [flagsAbsent, setFlagsAbsent] = useState<number[]>([]);
  const [hasShift, setHasShift] = useState<boolean>(false);

  const [selectedEmployees, setSelectedEmployees] = useState<GridRowId[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isFlagsModalOpen, setIsFlagsModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['employees', search, foremanId, flagsPresent, flagsAbsent, hasShift],
    ({ pageParam = 0 }) => getEmployees({
      search, foremanId, flagsPresent, flagsAbsent, hasShift
    }, { page: pageParam, perPage: 10 }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
      },
      getPreviousPageParam: (firstPage) => {
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
    // { @TODO: set permissions on s3 bucket
    //   field: 'photoPath',
    //   headerName: 'Фото',
    //   sortable: false,
    //   width: 100,
    //   renderCell: (params: GridRenderCellParams) => {
    //     return (
    //       <img
    //         src={`${config.s3Url}/${params.value as string}}`}
    //         alt={`${params.row.firstName} ${params.row.lastName}`}
    //         style={{
    //           width: '100%',
    //           height: '100%',
    //           objectFit: 'cover',
    //         }}
    //       />
    //     );
    //   }
    // },
    {
      field: 'fullName',
      headerName: 'Имя и фамилия',
      sortable: true,
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'contract',
      headerName: 'Номер договора',
      sortable: false,
      width: 160,
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
      field: 'phone',
      headerName: 'Телефон',
      sortable: false,
      width: 160,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <a href={`tel:${params.value as string}`}>
            {params.value}
          </a>
        );
      }
    },
    {
      field: 'address',
      headerName: 'Адрес',
      sortable: false,
      width: 160,
    },
    {
      field: 'additionalInfo',
      headerName: 'Дополнительная информация',
      sortable: false,
      width: 220,
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
            <IconButton
              onClick={() => {
                setCalculatingEmployee(params.row);
              }}
              title="Расчет"
            >
              <PointOfSale />
            </IconButton>
          </>
        );
      }
    }
  ]), []);

  const onPrintModalClose = useCallback(() => {
    setIsPrintModalOpen(false);
    setSelectedEmployees([]);
  }, []);

  const onFlagsModalClose = useCallback(() => {
    setIsFlagsModalOpen(false);
    setSelectedEmployees([]);
    refetch();
  }, []);

  const onShiftModalClose = useCallback(() => {
    setIsShiftModalOpen(false);
    setSelectedEmployees([]);
    refetch();
  }, []);


  const rows = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);
  const totalItems = useMemo(() => data?.pages[0].totalItems || 0, [data]);

  return (
    <>
      {
        isPrintModalOpen && (
          <PrintModal
            selected={selectedEmployees}
            onClose={onPrintModalClose}
            allData={rows}
          />
        )
      }
      {
        selectedEmployees.length > 0 && isFlagsModalOpen && (
          <FlagsModal
            selected={selectedEmployees}
            onClose={onFlagsModalClose}
          />
        )
      }
      {
        selectedEmployees.length > 0 && isShiftModalOpen && (
          <ShiftModal
            selected={selectedEmployees}
            onClose={onShiftModalClose}
          />
        )
      }
      <CalculateModal
        empData={calculatingEmployee}
        onClose={() => setCalculatingEmployee(null)}
      />
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
      <SearchToolbar
        onSearchSubmit={setSearch}
        foremanId={foremanId}
        setForemanId={setForemanId}
        flagsPresent={flagsPresent}
        setFlagsPresent={setFlagsPresent}
        flagsAbsent={flagsAbsent}
        setFlagsAbsent={setFlagsAbsent}
        hasShift={hasShift}
        setHasShift={setHasShift}
      />
      <DataGridLimitedHeight
        columns={columns as any}
        rows={rows}
        loading={isFetching}
        slots={{
          pagination: () => (
            <PaginationWrapper>
              {
                hasNextPage && (
                  <FetchMoreButton
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    Показать еще
                  </FetchMoreButton>
                )
              }
              <PagesInfo>
                {rows.length} из {totalItems}
              </PagesInfo>
            </PaginationWrapper>
          ),
          row: (params) => {
            const flags = params.row.flags || [];

            const hasShift = params.row.shifts?.length > 0;

            return <WithFlagsBar flags={flags} hasShift={hasShift}>
              <GridRow {...params} />
            </WithFlagsBar>;
          }
          // toolbar: GridToolbar, @TODO: implement
        }}
        checkboxSelection={true}
        onRowSelectionModelChange={(params) => {
          selectedEmployeesIds = params;
        }}
        localeText={
          ruRU.components.MuiDataGrid.defaultProps.localeText
        }
      />
      <AddButton
        onClick={() => navigate('/employees/create')}
      >
        Добавить
      </AddButton>
      <PageActionButton
        startIcon={<QrCode2 />}
        onClick={() => {
          setSelectedEmployees(selectedEmployeesIds);
          setIsPrintModalOpen(true);
        }}
      >
        Печатать
      </PageActionButton>
      <PageActionButton
        startIcon={<Flag />}
        onClick={() => {
          setSelectedEmployees(selectedEmployeesIds);
          setIsFlagsModalOpen(true);
        }}
      >
        Пометить
      </PageActionButton>
      <PageActionButton
        startIcon={<AddTask />}
        onClick={() => {
          setSelectedEmployees(selectedEmployeesIds);
          setIsShiftModalOpen(true);
        }}
      >
        Установить смену на завтра
      </PageActionButton>
    </>
  );
}

export default authorized(EmployeesPage);
