import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import useAuthenticatedMutation from "../../../api/auth/hooks/useAuthenticatedMutation";
import addEmployee, { AddEmployeeRequest } from "../../../api/mutationFns/employees/addemployee.mutation";
import getFlags, { FlagItem } from "../../../api/queryFns/flags.query";
import getForemen, { ForemanTableItem } from "../../../api/queryFns/foremen.query";
import { notification } from "../../../components/Notifications/Notifications";
import Form from "../../../components/common/Form/Form";
import { FetchSelectConfig, FieldData } from "../../../components/common/Form/types";
import LoadingBox from "../../../components/common/LoadingBox/LoadingBox";
import authorized from "../../../helpers/withAuth";
import { Container } from "./elements";

const employeeFormFields: FieldData[] = [
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
    name: 'foremanId',
    label: 'Бригадир',
    type: 'fetch-select',
    fetchSelectConfig: {
      queryFn: getForemen,
      multiple: false,
      showInOption: [{
        key: 'firstName',
        type: 'text'
      }, {
        key: 'lastName',
        type: 'text'
      }],
      showInValue: [{
        key: 'firstName',
        type: 'text'
      }, {
        key: 'lastName',
        type: 'text'
      }],
      valueKey: 'id',
    } as FetchSelectConfig<ForemanTableItem>,
  },
  {
    name: 'address',
    label: 'Адрес',
    type: 'text',
  },
  {
    name: 'phone',
    label: 'Телефон',
    type: 'phone',
  },
  {
    name: 'contract',
    label: 'Номер договора',
    type: 'text',
  },
  {
    name: 'flags',
    label: 'Метки',
    type: 'fetch-select',
    fetchSelectConfig: {
      queryFn: getFlags,
      multiple: true,
      showInOption: [{
        key: 'name',
        type: 'text'
      }],
      showInValue: [{
        key: 'name',
        type: 'text'
      }],
      valueKey: 'id',
    } as FetchSelectConfig<FlagItem>,
  },
  {
    name: 'additionalInfo',
    label: 'Дополнительная информация',
    type: 'textarea',
  },
  // {
  //   name: 'photo',
  //   label: 'Фото',
  //   type: 'file',
  // }
];

function CreateEmployee() {
  const navigate = useNavigate();

  const {
    mutate: createEmployeeMutation,
    isLoading,
  } = useAuthenticatedMutation({
    mutationKey: ['createEmployee'],
    mutationFn: addEmployee,
    onSuccess: ({
      firstName, lastName
    }) => {
      notification.open({
        type: 'success',
        title: `Сотрудник ${firstName} ${lastName} успешно создан`,
      });
      navigate('/employees');
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при создании сотрудника',
        text: (error as Error).message,
      });
    }
  })

  return (
    <Container>
      <Form<AddEmployeeRequest>
        fields={employeeFormFields}
        submitText="Создать сотрудника"
        onSubmit={(values) => createEmployeeMutation(values)}
        loading={isLoading}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Это поле обязательно для заполнения'),
          lastName: Yup.string().required('Это поле обязательно для заполнения'),
          foremanId: Yup.number().required('Это поле обязательно для заполнения'),
          address: Yup.string(),
          phone: Yup.string().required('Это поле обязательно для заполнения'),
          contract: Yup.string(),
          flags: Yup.array().of(Yup.number()),
          additionalInfo: Yup.string(),
        })}
      />
    </Container>
  );
}

export default authorized(CreateEmployee);
