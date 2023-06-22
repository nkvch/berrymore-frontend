import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePaginatedQuery from "../../api/hooks/usePaginatedQuery";
import getForemen, { ForemanTableItem } from "../../api/queryFns/foremen.query";
import Modal from "../../components/common/Modal/Modal";
import authorized from "../../helpers/withAuth";
import { AddButton } from "./elements";


function ForemenPage() {
  const navigate = useNavigate();

  const [deletingForemanId, setDeletingForemanId] = useState<number | null>(null);

  const {
    data,
    isFetching,
    page,
    perPage,
    setPage,
    setPerPage,
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
