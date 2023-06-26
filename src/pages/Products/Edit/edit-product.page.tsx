import { CircularProgress } from "@mui/material";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import useAuthenticatedMutation from "../../../api/auth/hooks/useAuthenticatedMutation";
import useAuthenticatedQuery from "../../../api/auth/hooks/useAuthenticatedQuery";
import updateForeman, { UpdateForemanRequest } from "../../../api/mutationFns/updateforeman.mutation";
import getForeman from "../../../api/queryFns/foreman.query";
import { notification } from "../../../components/Notifications/Notifications";
import Form from "../../../components/common/Form/Form";
import { FieldData } from "../../../components/common/Form/types";
import authorized from "../../../helpers/withAuth";
import { Container } from "./elements";
import getProduct from "../../../api/queryFns/product.query";
import updateProductMutationFn, { UpdateProductMutationData } from "../../../api/mutationFns/products/update-product.mutation";
import LoadingBox from "../../../components/common/LoadingBox/LoadingBox";

const productFormFields: FieldData[] = [
  {
    name: 'productName',
    label: 'Название',
    type: 'text',
    validation: Yup.string().required('Это поле обязательно для заполнения'),
  },
  {
    name: 'productPrice',
    label: 'Оплата за кг',
    type: 'number',
    validation: Yup.string().required('Это поле обязательно для заполнения'),
  },
  // {
  //   name: 'photo',
  //   label: 'Фото',
  //   type: 'file',
  // }
];

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data: product,
    isFetching,
  } = useAuthenticatedQuery(
    ['product', id],
    () => getProduct({ id: Number(id) }),
    {
      enabled: !!id,
    }
  );

  const {
    mutate: updateProductMutation,
    isLoading,
  } = useAuthenticatedMutation({
    mutationKey: ['updateProduct', id],
    mutationFn: updateProductMutationFn,
    onSuccess: ({
      productName
    }) => {
      notification.open({
        type: 'success',
        title: `Продукт ${productName} успешно обновлен`,
      });
      navigate('/products');
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при обновлении продукта',
        text: (error as Error).message,
      });
    }
  });

  const productFormInitialValues = useMemo(() => (product ? {
    productName: product?.productName,
    productPrice: product?.productPrice,
  } : null), [product]);

  return (
    <Container>
      {
        productFormInitialValues ?
          <Form<Omit<UpdateProductMutationData, 'id'>>
            fields={productFormFields}
            submitText="Сохранить"
            initialValues={productFormInitialValues}
            onSubmit={(values) => updateProductMutation({ ...values, id: Number(id) })}
            loading={isLoading || isFetching}
          /> : <LoadingBox />
      }
    </Container>
  );
}

export default authorized(EditProduct);
