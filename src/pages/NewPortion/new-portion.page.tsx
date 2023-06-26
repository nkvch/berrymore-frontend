import { QrCodeScanner } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';
import useAuthenticatedMutation from '../../api/auth/hooks/useAuthenticatedMutation';
import useAuthenticatedQuery from '../../api/auth/hooks/useAuthenticatedQuery';
import addToHistoryMutation, { AddToHistoryData } from '../../api/mutationFns/history/add-to-history.mutation';
import getEmployeeByBerryId from '../../api/queryFns/employee-by-berry-id.query';
import getEmployees from '../../api/queryFns/employees.query';
import getProducts from '../../api/queryFns/products.query';
import { notification } from '../../components/Notifications/Notifications';
import Form from '../../components/common/Form/Form';
import { FieldData } from '../../components/common/Form/types';
import authorized from '../../helpers/withAuth';
import mobileState from '../../recoil/mobileState';

function AddPortion() {
  const isMobile = useRecoilValue(mobileState);
  const [useQr, setUseQr] = useState(false);
  const [berryId, setBerryId] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    data: employee,
    isFetching: isFetchingEmployee,
  } = useAuthenticatedQuery(
    ['employees', berryId],
    () => berryId ? getEmployeeByBerryId(berryId) : undefined,
    {
      enabled: !!berryId,
    }
  );

  const {
    mutate: addToHistory,
    isLoading
  } = useAuthenticatedMutation({
    mutationKey: ['history'],
    mutationFn: addToHistoryMutation,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: 'Данные успешно записаны',
      });
      navigate('/stats');
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при записи данных',
        text: error.message,
      });
    }
  });

  useEffect(() => {
    if (isMobile) {
      navigator?.mediaDevices?.getUserMedia({
        video: {
          facingMode: { exact: 'environment' },
        }
      }).then(() => setUseQr(true), () => setUseQr(false));
    }
  }, [isMobile]);

  const validationSchema = Yup.object().shape({
    employeeId: Yup.number().required('Выберите сотрудника'),
    productId: Yup.number().required('Выберите продукт'),
    amount: Yup.number().required('Введите количество продукта'),
    dateTime: Yup.date().required('Введите дату и время'),
  });


  const fieldsData: FieldData[] = useMemo(() => ([
    {
      name: 'employeeId',
      label: 'Выберите сотрудника',
      type: 'fetch-select',
      fetchSelectConfig: {
        queryFn: (search, pagParams) => getEmployees({ search }, pagParams),
        backendSearch: true,
        preloadedValues: employee,
        showInOption: [{
          key: 'firstName',
          type: 'text',
        }, {
          key: 'lastName',
          type: 'text',
        }],
        showInValue: [{
          key: 'firstName',
          type: 'text',
        }, {
          key: 'lastName',
          type: 'text',
        }],
        valueKey: 'id',
      },
    },
    {
      name: 'productId',
      label: 'Выберите продукт',
      type: 'fetch-select',
      fetchSelectConfig: {
        queryFn: (_, pagParams) => getProducts(pagParams),
        showInOption: [{
          key: 'productName',
          type: 'text',
        }],
        showInValue: [{
          key: 'productName',
          type: 'text',
        }],
        valueKey: 'id',
      },
    },
    {
      name: 'amount',
      label: 'Количество продукта (кг)',
      type: 'number',
    },
    {
      name: 'dateTime',
      label: 'Дата и время',
      type: 'datetime-local',
    },
  ]), [employee]);

  const initialValues = useMemo(() => ({
    employeeId: employee?.id ?? 0,
    productId: Number(localStorage.getItem('productId')),
    amount: '',
    dateTime: new Date(),
  }), [employee]);

  return (
    <div className="block">
      {isMobile && useQr && !berryId ? (
        <>
          <h1>Новая порция</h1>
          <p>Отсканируйте QR-код сотрудника, чтобы добавить новую порцию ягод</p>
          <QrReader
            constraints={{
              facingMode: { exact: "environment" },
            }}
            onResult={(result, err) => {
              if (result) {
                setBerryId(result.getText());
              }

              if (err) {
                console.log(err);
              }
            }}
          />
          <Button
            variant="contained"
            onClick={() => setUseQr(false)}
            style={{ width: '100%' }}
          >
            Выбрать вручную
          </Button>
        </>
      ) : isMobile && berryId && isFetchingEmployee && !employee?.id ? <CircularProgress /> : (
        <>
          <h1>Новая порция</h1>
          <p>Заполните форму, чтобы добавить новую порцию ягод</p>
          <Form<AddToHistoryData>
            onSubmit={(values) => {
              addToHistory(values);
            }}
            initialValues={initialValues}
            submitText="Сохранить"
            fields={fieldsData}
            validationSchema={validationSchema}
            loading={isLoading}
          />
          {
            isMobile && !useQr && (
              <Button
                variant="outlined"
                onClick={() => setUseQr(true)}
                style={{ width: '100%', marginTop: '1rem' }}
                startIcon={<QrCodeScanner />}
              >
                Сканировать QR-код
              </Button>
            )
          }
        </>
      )}
    </div>
  );
};

export default authorized(AddPortion);
