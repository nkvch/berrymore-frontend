import { AddTask, Delete, Edit, Flag, PointOfSale, QrCode2 } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams, GridRow, GridRowId, GridRowSelectionModel, GridValueGetterParams, ruRU } from "@mui/x-data-grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import getEmployees, { EmployeeTableItem } from "../../api/queryFns/employees.query";
import authorized from "../../helpers/withAuth";
import CalculateModal from "./components/CalculateModal/CalculateModal";
import DeleteModal from "./components/DeleteModal/DeleteModal";
import FlagsModal from "./components/FlagsModal/FlagsModal";
import PrintModal from "./components/PrintModal/PrintModal";
import SearchToolbar from "./components/SearchToolbar/SearchToolbar";
import ShiftModal from "./components/ShiftModal/ShiftModal";
import WithFlagsBar from "./components/WithFlagsBar/WithFlagsBar";
import { GridPagination } from "@mui/x-data-grid";
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

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

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
        `${params.row.lastName || ''} ${params.row.firstName || ''}`,
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
        `${params.row.foreman?.lastName || ''} ${params.row.foreman?.firstName || ''}`,
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
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/employees/${params.row.id}`);
              }}
              title="Редактировать"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                setDeletingEmployee(params.row);
              }}
              title="Удалить"
            >
              <Delete />
            </IconButton>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
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

  const isCurrentPageFull = useMemo(() => {
    return rows.length >= pageSize * (currentPage + 1)
  }, [rows, pageSize, currentPage]);

  const isCurrentPageLastLoaded = useMemo(() => {
    return rows.length <= pageSize * (currentPage + 1)
  }, [rows, pageSize, currentPage]);

  const shouldLoadMoreBeVisible = useMemo(() => {
    return hasNextPage && isCurrentPageLastLoaded;
  }, [hasNextPage, isCurrentPageFull, isCurrentPageLastLoaded]);

  const shouldLoadMoreMoveToNextPage = useMemo(() => {
    return hasNextPage && isCurrentPageFull;
  }, [hasNextPage, isCurrentPageFull, isCurrentPageLastLoaded]);

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
      <DeleteModal
        employee={deletingEmployee}
        onClose={() => {
          setDeletingEmployee(null);
          refetch();
        }}
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
        paginationModel={{
          page: currentPage,
          pageSize,
        }}
        onPaginationModelChange={(params) => {
          setCurrentPage(params.page);
          setPageSize(params.pageSize);
        }}
        slots={{
          pagination: () => (
            <PaginationWrapper>
              {
                shouldLoadMoreBeVisible && (
                  <FetchMoreButton
                    onClick={() => {
                      fetchNextPage().then(() => {
                        if (shouldLoadMoreMoveToNextPage) {
                          setCurrentPage(currentPage + 1);
                        }
                      })
                    }}
                    disabled={!hasNextPage || isFetchingNextPage}
                  >
                    Показать еще {shouldLoadMoreMoveToNextPage ? '(след. страница)' : ''}
                  </FetchMoreButton>
                )
              }
              <GridPagination />
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
        checkboxSelection
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
