import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import authorized from "../../helpers/withAuth";
import { useMemo, useState } from "react";
import getForemen, { ForemanTableItem } from "../../api/queryFns/foremen.query";
import usePaginatedQuery from "../../api/hooks/usePaginatedQuery";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { AddButton } from "./elements";
import { Delete, Edit } from "@mui/icons-material";
import Modal from "../../components/common/Modal/Modal";


function ForemenPage() {
  const navigate = useNavigate();

  const [deletingForemanId, setDeletingForemanId] = useState<number | null>(null);

  const {
    data,
    isFetching,
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
    page,
    perPage,
    setPage,
    setPerPage,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
  } = usePaginatedQuery<ForemanTableItem>(
    ['foremen'],
    getForemen,
  );

  const columns: GridColDef<ForemanTableItem>[] = useMemo(() => ([
    {
      field: 'fullName',
      headerName: 'Имя и фамилия',
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
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
                navigate(`/foremen/${params.row.id}`);
              }}
              title="Редактировать"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setDeletingForemanId(params.row.id);
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
      <Modal
        open={!!deletingForemanId}
        onClose={() => setDeletingForemanId(null)}
      >
        rgrtshytdh
      </Modal>
      <DataGrid
        columns={columns}
        rows={data?.items ?? []}
        loading={isFetching}
        pageSizeOptions={[
          10, 25
        ]}
        pagination

        paginationMode='server'
        rowSelection={false}
        paginationModel={{
          page,
          pageSize: perPage,
        }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPerPage(model.pageSize);
        }}
      />
      <AddButton
        onClick={() => navigate('/foremen/create')}
      >
        Добавить
      </AddButton>
    </>
  );
}

export default authorized(ForemenPage);
