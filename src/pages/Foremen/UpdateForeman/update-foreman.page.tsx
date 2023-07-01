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

const foremanFormFields: FieldData[] = [
  {
    name: 'firstName',
    label: 'Имя',
    type: 'text',
    validation: Yup.string().required('Это поле обязательно для заполнения'),
  },
  {
    name: 'lastName',
    label: 'Фамилия',
    type: 'text',
    validation: Yup.string().required('Это поле обязательно для заполнения'),
  },
  {
    name: 'email',
    label: 'Email (необязательно)',
    type: 'email',
    validation: Yup.string().email('Неверный формат email'),
  },
];

function UpdateForeman() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data: foreman,
    isFetching,
  } = useAuthenticatedQuery(
    ['foreman', id],
    () => getForeman({ id: Number(id) }),
    {
      enabled: !!id,
    }
  );

  const {
    mutate: updateForemanMutation,
    isLoading,
  } = useAuthenticatedMutation({
    mutationKey: ['updateForeman', id],
    mutationFn: updateForeman,
    onSuccess: ({
      firstName, lastName
    }) => {
      notification.open({
        type: 'success',
        title: `Бригадир ${lastName} ${firstName} успешно обновлен`,
      });
      navigate('/foremen');
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при обновлении бригадира',
        text: (error as Error).message,
      });
    }
  });

  const foremanFormInitialValues = useMemo(() => ({
    firstName: foreman?.firstName || '',
    lastName: foreman?.lastName || '',
  }), [foreman]);

  return (
    <Container>
      {
        (isLoading || isFetching) ? <CircularProgress /> : <Form<Omit<UpdateForemanRequest, 'id'>>
          fields={foremanFormFields}
          submitText="Создать бригадира"
          initialValues={foremanFormInitialValues}
          onSubmit={(values) => updateForemanMutation({ ...values, id: Number(id) })}
        />
      }
    </Container>
  );
}

export default authorized(UpdateForeman);
