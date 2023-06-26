import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import useAuthenticatedMutation from "../../../api/auth/hooks/useAuthenticatedMutation";
import useAuthenticatedQuery from "../../../api/auth/hooks/useAuthenticatedQuery";
import updateEmployee, { UpdateEmployeeRequest } from "../../../api/mutationFns/employees/update-employee.mutation";
import getEmployeeById from "../../../api/queryFns/employee.query";
import getFlags, { FlagItem } from "../../../api/queryFns/flags.query";
import getForemen, { ForemanTableItem } from "../../../api/queryFns/foremen.query";
import { notification } from "../../../components/Notifications/Notifications";
import Form from "../../../components/common/Form/Form";
import { FetchSelectConfig, FieldData } from "../../../components/common/Form/types";
import LoadingBox from "../../../components/common/LoadingBox/LoadingBox";
import authorized from "../../../helpers/withAuth";
import { Container } from "./elements";

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: employee,
    isFetching,
  } = useAuthenticatedQuery(
    ['employee', id],
    () => getEmployeeById(Number(id)),
    {
      enabled: !!id,
    }
  );

  const employeeFormFields: FieldData[] = useMemo(() => ([
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
        preloadedValues: employee?.foreman,
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
        preloadedValues: employee?.flags,
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
  ]), [employee]);

  const {
    mutate: updateEmployeeMutation,
    isLoading,
  } = useAuthenticatedMutation({
    mutationKey: ['updateEmployee'],
    mutationFn: (values: UpdateEmployeeRequest) => updateEmployee(Number(id), values),
    onSuccess: ({
      firstName, lastName
    }) => {
      notification.open({
        type: 'success',
        title: `Данные сотрудника ${firstName} ${lastName} успешно обновлены`,
      });
      navigate('/employees');
    },
    onError: (error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при обновлении данных сотрудника',
        text: (error as Error).message,
      });
    }
  });

  const initialValues = useMemo(() => {
    if (!employee) {
      return undefined;
    }

    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      foremanId: employee.foreman.id,
      address: employee.address,
      phone: employee.phone,
      contract: employee.contract,
      flags: employee.flags.map((flag) => flag.id),
      additionalInfo: employee.additionalInfo,
    }
  }, [employee]);

  return (
    <Container>
      {isFetching && <LoadingBox />}
      {initialValues && <Form<UpdateEmployeeRequest>
        fields={employeeFormFields}
        submitText="Сохранить"
        onSubmit={(values) => updateEmployeeMutation(values)}
        loading={isLoading}
        initialValues={initialValues}
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
      />}
    </Container>
  );
}

export default authorized(EditEmployee);
