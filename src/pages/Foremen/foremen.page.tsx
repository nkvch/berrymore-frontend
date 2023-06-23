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


function ForemenPage() {
  const navigate = useNavigate();

  const [deletingForeman, setDeletingForeman] = useState<ForemanTableItem | null>(null);

  const {
    data,
    isFetching,
    page,
    perPage,
    setPage,
    setPerPage,
    refetch,
  } = usePaginatedQuery<ForemanTableItem>(
    ['foremen'],
    (pagParams) => getForemen('', pagParams),
  );

  const {
    mutate: deleteForemanMutation,
    isLoading: isDeleting,
  } = useAuthenticatedMutation<unknown, Error, DeleteForemanMutationVariables>({
    mutationKey: ['deleteForeman', deletingForeman?.id],
    mutationFn: deleteForemanMutationFn,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: `Бригадир ${deletingForeman?.firstName} ${deletingForeman?.lastName} успешно удален`,
      });
      setDeletingForeman(null);
      refetch();
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении бригадира',
        text: error.message,
      });
    }
  })

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
                setDeletingForeman(params.row);
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
        open={!!deletingForeman}
        onCancel={() => setDeletingForeman(null)}
        onConfirm={() => {
          if (deletingForeman) {
            deleteForemanMutation({
              id: deletingForeman.id,
            });
          }
        }}
        loading={isDeleting}
        title="Удаление бригадира"
        text={`Вы действительно хотите удалить бригадира ${deletingForeman?.firstName} ${deletingForeman?.lastName}? Данное действие нельзя отменить.`}
      />
      <DataGrid
        columns={columns}
        rows={data?.items || []}
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
