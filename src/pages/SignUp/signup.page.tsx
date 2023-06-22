import { CircularProgress, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import confirm from "../../api/mutationFns/confirm.mutation";
import signUp, { SignUpRequest } from "../../api/mutationFns/signup.mutation";
import { notification } from "../../components/Notifications/Notifications";
import Form from "../../components/common/Form/Form";
import { FieldData } from "../../components/common/Form/types";
import { FormContainer } from "./elements";

const signUpFormFields: FieldData[] = [
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
    label: 'Email',
    type: 'email',
    validation: Yup.string().email('Неверный формат email').required('Это поле обязательно для заполнения'),
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

const confirmEmailFormFields = [
  {
    name: 'token',
    label: 'Код подтверждения',
    type: 'text',
  },
];

enum SignUpSteps {
  FillForm,
  ConfirmEmail,
}

function SignUp() {
  const [step, setStep] = useState(SignUpSteps.FillForm);
  const navigate = useNavigate();

  const {
    mutate: signUpMutation,
    isLoading,
  } = useMutation(signUp, {
    onSuccess: ({ message }) => {
      notification.open({
        type: 'success',
        title: 'Успешно',
        text: message,
      });
      setStep(SignUpSteps.ConfirmEmail);
    }
  });

  const {
    mutate: confirmEmailMutation,
    isLoading: isConfirmEmailLoading,
  } = useMutation(confirm, {
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: 'Регистрация прошла успешно',
      });
      navigate('/signin');
    }
  });

  return (
    <FormContainer>
      <Typography variant="body1">
        {
          step === SignUpSteps.FillForm ?
            'Заполните форму для регистрации' :
            'Введите код подтверждения, который был отправлен на вашу почту'
        }
      </Typography>
      {
        step === SignUpSteps.FillForm && (
          <>
            {
              isLoading ? <CircularProgress /> :
                <Form<SignUpRequest>
                  onSubmit={(vals) => {
                    signUpMutation(vals);
                  }} fields={signUpFormFields} submitText="Зарегистрироваться" />
            }
          </>
        )
      }
      {
        step === SignUpSteps.ConfirmEmail && (
          <>
            {
              isConfirmEmailLoading ? <CircularProgress /> :
                <Form<{ token: string }>
                  onSubmit={(vals) => {
                    confirmEmailMutation(vals);
                  }} fields={confirmEmailFormFields} submitText="Подтвердить" />
            }
          </>
        )
      }
    </FormContainer>);
}

export default SignUp;
