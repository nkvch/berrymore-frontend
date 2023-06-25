import { addDays, startOfDay } from "date-fns";
import useAuthenticatedMutation from "../../../../api/auth/hooks/useAuthenticatedMutation";
import addShift from "../../../../api/mutationFns/shifts/add-shift.mutation";
import { notification } from "../../../../components/Notifications/Notifications";
import ConfirmModal from "../../../../components/common/Modal/variants/ConfirmModal/ConfirmModal";
import { GridRowId } from "@mui/x-data-grid";

interface ShiftModalProps {
  selected: GridRowId[];
  onClose: () => void;
}

function ShiftModal(props: ShiftModalProps) {
  const {
    selected,
    onClose
  } = props;

  const {
    mutate: setShiftForTomorrow,
    isLoading
  } = useAuthenticatedMutation({
    mutationFn: addShift,
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: 'Смена успешно добавлена',
      })
      onClose();
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при добавлении смены',
        text: error.message,
      })
    }
  });

  return (
    <ConfirmModal
      open
      loading={isLoading}
      title="Добавить смену"
      text="Вы уверены, что хотите добавить смену для выбранных сборщиков?"
      onCancel={onClose}
      onConfirm={() => setShiftForTomorrow({
        employeeIds: selected as number[],
        startDate: startOfDay(addDays(new Date(), 1)),
        endDate: startOfDay(addDays(new Date(), 1)),
      })}
    />
  )
}

export default ShiftModal;
