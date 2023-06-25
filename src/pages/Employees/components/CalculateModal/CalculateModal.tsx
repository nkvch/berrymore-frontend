import { PointOfSale } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { endOfDay } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import useAuthenticatedMutation from '../../../../api/auth/hooks/useAuthenticatedMutation';
import useAuthenticatedQuery from '../../../../api/auth/hooks/useAuthenticatedQuery';
import markAsPaid from '../../../../api/mutationFns/history/mark-as-paid.mutation';
import calculateEmployee from '../../../../api/queryFns/calculate-employee.query';
import { EmployeeTableItem } from '../../../../api/queryFns/employees.query';
import { notification } from '../../../../components/Notifications/Notifications';
import LoadingBox from '../../../../components/common/LoadingBox/LoadingBox';
import Modal from '../../../../components/common/Modal/Modal';
import ConfirmModal from '../../../../components/common/Modal/variants/ConfirmModal/ConfirmModal';
import getStartOfToday from '../../../../utils/getStartOfToday';
import { DatesForm, ModalTitle, PayButton } from './elements';

interface CalculateModalProps {
  empData: EmployeeTableItem | null;
  onClose: () => void;
}

const CalculateModal = ({ onClose, empData }: CalculateModalProps) => {
  const [isInit, setIsInit] = useState(true);
  const [customPeriod, setCustomPeriod] = useState(false);

  const [fromDateTime, setFromDateTime] = useState<Date | undefined>();
  const [toDateTime, setToDateTime] = useState<Date | undefined>();
  const [isConfirmPayModalOpen, setIsConfirmPayModalOpen] = useState(false);

  const {
    data: calcData,
    isFetching: isCalculating,
  } = useAuthenticatedQuery(
    ['calculate', empData?.id, fromDateTime, toDateTime],
    () => calculateEmployee(empData!.id, {
      fromDateTime,
      toDateTime,
    }),
    {
      enabled: !isInit && !!empData,
    }
  );

  const {
    mutate: markAsPaidMutate,
    isLoading,
  } = useAuthenticatedMutation({
    mutationKey: ['markAsPaid'],
    mutationFn: markAsPaid,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: 'Данные успешно записаны',
      });
      setIsConfirmPayModalOpen(false);
      onClose();
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при записи данных',
        text: error.message,
      });
    }
  });

  const handleClose = useCallback(() => {
    setCustomPeriod(false);
    setFromDateTime(undefined);
    setToDateTime(undefined);
    setIsInit(true);
    onClose();
  }, [onClose]);

  const confirmModalText = useMemo(() => {
    if (!isConfirmPayModalOpen)
      return '';

    if (fromDateTime && toDateTime)
      return `Вы уверены, что хотите отметить сборщика ${empData?.firstName} ${empData?.lastName} как рассчитанного за период с ${fromDateTime.toLocaleString()} по ${toDateTime.toLocaleString()}?`;

    if (fromDateTime && !toDateTime)
      return `Вы уверены, что хотите отметить сборщика ${empData?.firstName} ${empData?.lastName} как рассчитанного с ${fromDateTime.toLocaleString()} по настоящее время?`;

    if (!fromDateTime && toDateTime)
      return `Вы уверены, что хотите отметить сборщика ${empData?.firstName} ${empData?.lastName} как рассчитанного с начала работы по ${toDateTime.toLocaleString()}?`;

    return `Вы уверены, что хотите отметить сборщика ${empData?.firstName} ${empData?.lastName} как рассчитанного с начала работы по настоящее время?`;
  }, [isConfirmPayModalOpen]);

  return (
    <>
      <ConfirmModal
        title='Подтвердите оплату'
        text={confirmModalText}
        open={isConfirmPayModalOpen}
        onCancel={() => setIsConfirmPayModalOpen(false)}
        onConfirm={() => {
          markAsPaidMutate({
            employeeId: empData!.id,
            fromDateTime: fromDateTime || undefined,
            toDateTime: toDateTime || undefined,
          })
        }}
        loading={isLoading}
      />
      <Modal
        open={!!empData}
        onClose={handleClose}
      >
        <Box>
          <ModalTitle>
            Рассчёт сборщика{' '}
            {empData ? `${empData.firstName} ${empData.lastName}` : ''}
          </ModalTitle>
          <p>За какой период рассчиать сборщика?</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <Button
              variant="contained"
              style={{
                flex: 1,
              }}
              color='success'
              onClick={() => {
                setCustomPeriod(false);
                setFromDateTime(getStartOfToday());
                setToDateTime(endOfDay(new Date()));
                setIsInit(false);
              }}
            >
              За сегодня
            </Button>
            <Button
              variant="contained"
              style={{
                flex: 1,
              }}
              onClick={() => {
                setCustomPeriod(false);
                setFromDateTime(undefined);
                setToDateTime(undefined);
                setIsInit(false);
              }}
            >
              За всё время
            </Button>
            <Button
              variant="outlined"
              style={{
                flex: 1,
              }}
              onClick={() => {
                setCustomPeriod(true);
                setIsInit(false);
              }}
            >
              Другой период
            </Button>
          </div>
          {customPeriod && (
            <DatesForm
              fields={[
                {
                  name: 'fromDateTime',
                  type: 'datetime-local',
                  label: 'От',
                },
                {
                  name: 'toDateTime',
                  type: 'datetime-local',
                  label: 'До',
                },
              ]}
              onSubmit={(data) => {
                setCustomPeriod(false);
                setFromDateTime(data.fromDateTime);
                setToDateTime(data.toDateTime);
              }}
              submitText='Рассчитать'
            />
          )}
          {isCalculating && !isInit && (
            <LoadingBox />
          )}
          {calcData && (
            <>
              <p style={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                marginBottom: '0.5rem'
              }}>
                Собрано за период:{' '}
                {calcData.totalAmount.toFixed(2)} кг, {calcData.totalPay?.toFixed(2) || 0} руб.
              </p>
              {
                calcData.totalAmount > 0 && calcData.products.map(({ name, amount, pay }) => (
                  <p key={name}>
                    {name}: {amount.toFixed(2)} кг, {pay.toFixed(2) || 0} руб.
                  </p>
                ))
              }
            </>
          )}
          <PayButton
            disabled={isCalculating || !calcData || calcData.totalAmount === 0}
            onClick={() => setIsConfirmPayModalOpen(true)}
          >
            Заплатить <PointOfSale style={{ marginLeft: '0.5rem' }} />
          </PayButton>
        </Box>
      </Modal>
    </>
  );
};

export default CalculateModal;
