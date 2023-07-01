import { Alert } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import addForeman, { AddForemanRequest } from "../../../api/mutationFns/addforeman.mutation";
import { notification } from "../../../components/Notifications/Notifications";
import Form from "../../../components/common/Form/Form";
import { FieldData } from "../../../components/common/Form/types";
import LoadingBox from "../../../components/common/LoadingBox/LoadingBox";
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
  {
    name: 'username',
    label: 'Имя пользователя',
    type: 'text',
    validation: Yup.string().required('Это поле обязательно для заполнения'),
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    validation: Yup.string().min(8, 'Пароль должен быть не менее 8 символов').max(20, 'Пароль должен быть не более 20 символов').required('Это поле обязательно для заполнения'),
  },
];

function CreateForeman() {
  const navigate = useNavigate();

  const {
    mutate: createForemanMutation,
    isLoading,
  } = useMutation({
    mutationKey: ['createForeman'],
    mutationFn: addForeman,
    onSuccess: ({
      firstName, lastName
    }) => {
      notification.open({
        type: 'success',
        title: `Бригадир ${lastName} ${firstName} успешно создан`,
      });
      navigate('/foremen');
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при создании бригадира',
        text: (error as Error).message,
      });
    }
  })

  return (
    <Container>
      <Alert severity='info'>
        Бригадир создается как пользователь системы, но с ограниченными правами. Бригадир не может создавать и редактировать продукты но имеет доступ к их просмотру. Бригадир может создавать и редактировать своих сборщиков, a также записывать новые приносы от своих сотрудников и видеть статистику сбора по своей бригаде.

        Запомните <strong>логин</strong> и <strong>пароль</strong> бригадира, чтобы передать их ему лично. Логин и пароль нельзя будет подсмореть позже.
      </Alert>
      {
        isLoading ? <LoadingBox /> : <Form<AddForemanRequest>
          fields={foremanFormFields}
          submitText="Создать бригадира"
          onSubmit={(values) => createForemanMutation(values)}
        />
      }
    </Container>
  );
}

export default authorized(CreateForeman);
