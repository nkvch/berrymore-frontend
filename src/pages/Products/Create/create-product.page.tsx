import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import useAuthenticatedMutation from "../../../api/auth/hooks/useAuthenticatedMutation";
import createProductMutationFn, { CreateProductMutationData } from "../../../api/mutationFns/products/create-product.mutation";
import { notification } from "../../../components/Notifications/Notifications";
import Form from "../../../components/common/Form/Form";
import { FieldData } from "../../../components/common/Form/types";
import authorized from "../../../helpers/withAuth";
import { Container } from "./elements";

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

function CreateProduct() {
  const navigate = useNavigate();

  const {
    mutate: createProduct,
    isLoading,
  } = useAuthenticatedMutation({
    mutationKey: ['createEmployee'],
    mutationFn: createProductMutationFn,
    onSuccess: ({
      productName
    }) => {
      notification.open({
        type: 'success',
        title: `Продукт ${productName} успешно создан`,
      });
      navigate('/products');
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при создании продукта',
        text: (error as Error).message,
      });
    }
  })

  return (
    <Container>
      <Form<CreateProductMutationData>
        fields={productFormFields}
        submitText="Создать продукт"
        onSubmit={(values) => createProduct(values)}
        loading={isLoading}
        validationSchema={Yup.object().shape({
          productName: Yup.string().required('Это поле обязательно для заполнения'),
          productPrice: Yup.number().required('Это поле обязательно для заполнения'),
        })}
      />
    </Container>
  );
}

export default authorized(CreateProduct);
