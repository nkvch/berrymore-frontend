import { CheckCircleOutline, Delete, RemoveCircleOutline } from "@mui/icons-material";
import { GridColDef, GridRenderCellParams, GridValueGetterParams, ruRU } from "@mui/x-data-grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import getHistory, { HistoryItem } from "../../api/queryFns/history.query";
import authorized from "../../helpers/withAuth";
import { DataGridLimitedHeight, FetchMoreButton, PagesInfo, PaginationWrapper } from "./elements";
import SearchToolbar from "./components/SearchToolbar/SearchToolbar";
import { endOfDay, startOfDay } from "date-fns";
import useAuthenticatedMutation from "../../api/auth/hooks/useAuthenticatedMutation";
import deleteHistoryRecord from "../../api/mutationFns/history/delete-record.mutation";
import { notification } from "../../components/Notifications/Notifications";
import { IconButton } from "@mui/material";
import ConfirmModal from "../../components/common/Modal/variants/ConfirmModal/ConfirmModal";

function History() {
  const [fromDateTime, setFromDateTime] = useState<Date | undefined>(startOfDay(new Date()));
  const [toDateTime, setToDateTime] = useState<Date | undefined>(endOfDay(new Date()));
  const [foremanId, setForemanId] = useState<number | undefined>();
  const [productId, setProductId] = useState<number | undefined>();
  const [employeeId, setEmployeeId] = useState<number | undefined>();
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const [deletingRecord, setDeletingRecord] = useState<HistoryItem | null>(null);

  const {
    data: history,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['history', fromDateTime, toDateTime, foremanId, productId, employeeId, sort],
    ({ pageParam = 0 }) => getHistory({
      fromDateTime, toDateTime, foremanId, productId, employeeId, sort
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
      },
    },
  );

  const columns: GridColDef<HistoryItem>[] = useMemo(() => [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      sortable: false,
    },
    {
      field: 'dateTime',
      headerName: 'Дата и время',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => new Date(params.value).toLocaleString()
    },
    {
      field: 'amount',
      headerName: 'Количество',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => `${params.value} кг.`
    },
    {
      field: 'isPaid',
      headerName: 'Оплачено',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => params.value
        ? <CheckCircleOutline sx={{ color: 'green' }} />
        : <RemoveCircleOutline sx={{ color: 'yellow' }} />
    },
    {
      field: 'products',
      headerName: 'Продукт',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => params.value.productName
    },
    {
      field: 'employees',
      headerName: 'Сборщик',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => `${params.value.firstName} ${params.value.lastName}`
    },
    {
      field: 'foreman',
      headerName: 'Бригадир',
      width: 200,
      sortable: false,
      valueGetter: (params: GridValueGetterParams<HistoryItem>) =>
        `${params.row.employees.foreman.firstName} ${params.row.employees.foreman.lastName}`
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            setDeletingRecord(params.row);
          }}
          title="Удалить"
        >
          <Delete />
        </IconButton>
      )
    },
  ], []);

  const {
    mutate: deleteHistoryItem,
    isLoading: isDeleting,
  } = useAuthenticatedMutation({
    mutationKey: ['history', 'delete'],
    mutationFn: deleteHistoryRecord,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: 'Запись удалена',
      });
      refetch();
      setDeletingRecord(null);
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении записи',
        text: error.message,
      });
    }
  })

  const rows = useMemo(() => history?.pages.flatMap((page) => page.items) ?? [], [history]);
  const totalItems = useMemo(() => history?.pages[0].totalItems ?? 0, [history]);

  return (
    <>
      <ConfirmModal
        open={!!deletingRecord}
        onCancel={() => setDeletingRecord(null)}
        onConfirm={() => {
          if (deletingRecord) {
            deleteHistoryItem(deletingRecord.id);
          }
        }}
        title="Удаление записи"
        text={`Вы действительно хотите удалить запись №${deletingRecord?.id}?`}
        loading={isDeleting}
      />
      <SearchToolbar
        fromDateTime={fromDateTime}
        setFromDateTime={setFromDateTime}
        toDateTime={toDateTime}
        setToDateTime={setToDateTime}
        foremanId={foremanId}
        setForemanId={setForemanId}
        productId={productId}
        setProductId={setProductId}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        sort={sort}
        setSort={setSort}
      />
      <DataGridLimitedHeight
        loading={isFetching}
        rows={rows}
        columns={columns as any}
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
        }}
        localeText={
          ruRU.components.MuiDataGrid.defaultProps.localeText
        }
      />
    </>
  );
}

export default authorized(History);
