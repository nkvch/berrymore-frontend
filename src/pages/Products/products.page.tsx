import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, ruRU } from '@mui/x-data-grid';
import useAuthenticatedQuery from '../../api/auth/hooks/useAuthenticatedQuery';
import getProducts from '../../api/queryFns/products.query';
import { useInfiniteQuery } from '@tanstack/react-query';
import authorized from '../../helpers/withAuth';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import ConfirmModal from '../../components/common/Modal/variants/ConfirmModal/ConfirmModal';
import useAuthenticatedMutation from '../../api/auth/hooks/useAuthenticatedMutation';
import deleteProductMutationFn from '../../api/mutationFns/products/delete-product.mutation';
import { notification } from '../../components/Notifications/Notifications';
import { AddButton, DataGridLimitedHeight } from './elements';

type Product = {
  id: number;
  productName: string;
  productPrice: number;
  photoPath: string;
};

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const columns: GridColDef[] = useMemo(() => ([
    { field: 'productName', headerName: 'Продукт', width: 200 },
    { field: 'productPrice', headerName: 'Оплата за кг', width: 150 },
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
                navigate(`/products/${params.row.id}`);
              }}
              title="Редактировать"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                setDeletingProduct(params.row);
              }}
              title="Удалить"
            >
              <Delete />
            </IconButton>
          </>
        );
      }
    }
    // { field: 'photoPath', headerName: 'Фото', width: 200 }, @TODO:
  ]), []);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['products'],
    ({ pageParam = 0 }) => getProducts({ page: pageParam, perPage: 10 }),
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
    mutate: deleteProduct,
    isLoading: isDeleting,
  } = useAuthenticatedMutation({
    mutationFn: deleteProductMutationFn,
    onSuccess: (data) => {
      notification.open({
        type: 'success',
        title: `Продукт ${data.productName} успешно удален`,
      });

      setDeletingProduct(null);
      refetch();
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении продукта',
        text: error.message,
      });
    }
  })

  const rows = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

  return (
    <>
      <ConfirmModal
        open={!!deletingProduct}
        onCancel={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) {
            deleteProduct({
              id: deletingProduct.id,
            });
          }
        }}
        loading={isDeleting}
        title="Удаление продукта"
        text={`Вы действительно хотите удалить продукт ${deletingProduct?.productName}? Данное действие нельзя отменить.`}
      />
      <DataGridLimitedHeight
        rows={rows}
        columns={columns}
        localeText={
          ruRU.components.MuiDataGrid.defaultProps.localeText
        }
      />
      <AddButton
        onClick={() => navigate('/products/create')}
      >
        Добавить
      </AddButton>
    </>
  );
};

export default authorized(ProductsPage);
