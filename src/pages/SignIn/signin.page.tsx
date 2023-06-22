import { CircularProgress, Typography } from "@mui/material";
import Form from "../../components/common/Form/Form";
import { FormContainer } from "./elements";
import { useMutation } from "@tanstack/react-query";
import signIn from "../../api/mutationFns/signin.mutation";
import useLogin from "../../api/auth/hooks/useLogin";
import { notification } from "../../components/Notifications/Notifications";
import { useNavigate } from "react-router-dom";
import { FieldData } from "../../components/common/Form/types";
import * as Yup from 'yup';

const signInFormFields: FieldData[] = [
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
    validation: Yup.string().required('Это поле обязательно для заполнения'),
  },
];

function SignIn() {
  const login = useLogin();
  const navigate = useNavigate();

  const {
    mutate: signInMutation,
    isLoading,
  } = useMutation(signIn, {
    onSuccess: (response) => {
      login(response);
      notification.open({
        type: 'success',
        title: 'Вход успешно выполнен',
      });
      navigate('/stats');
    },
  });

  return (
    <FormContainer>
      <Typography variant="body1">
        Заполните форму для входа
      </Typography>
      {
        isLoading ? <CircularProgress /> :
          <Form<{ username: string, password: string }>
            onSubmit={(vals) => {
              signInMutation(vals);
            }} fields={signInFormFields} submitText="Войти" />
      }
    </FormContainer>);
}

export default SignIn;
