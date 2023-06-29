import { Alert, CircularProgress } from "@mui/material";
import { useMemo } from "react";
import useAuthenticatedMutation from "../../../../api/auth/hooks/useAuthenticatedMutation";
import useAuthenticatedQuery from "../../../../api/auth/hooks/useAuthenticatedQuery";
import archiveEmployee from "../../../../api/mutationFns/employees/archive-employee.mutation";
import deleteAllEmployeeData from "../../../../api/mutationFns/employees/delete-all-data.mutation";
import deleteEmployeeMutationFn from "../../../../api/mutationFns/employees/delete-employee.mutation";
import checkEmployeeData from "../../../../api/queryFns/check-employee-data.query";
import { EmployeeTableItem } from "../../../../api/queryFns/employees.query";
import { notification } from "../../../../components/Notifications/Notifications";
import LoadingBox from "../../../../components/common/LoadingBox/LoadingBox";
import Modal from "../../../../components/common/Modal/Modal";
import { ArchiveEmployee, DeleteAllEmplyeeData, DeleteEmployee, Title } from "./elements";

interface DeleteModalProps {
  employee: EmployeeTableItem | null;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ employee, onClose }) => {

  const {
    data: employeeHistoryAndShiftsData,
    isFetching: employeeHistoryAndShiftsIsFetching,
    refetch: refetchEmployeeHistoryAndShifts,
  } = useAuthenticatedQuery(
    ["employeeHistoryAndShifts", employee?.id],
    () => checkEmployeeData(employee!.id),
    {
      enabled: !!employee,
    }
  );

  const {
    mutate: deleteAllEmployeeDataMutation,
    isLoading: isDeletingAllEmployeeData,
  } = useAuthenticatedMutation({
    mutationKey: ['deleteAllEmployeeData', employee?.id],
    mutationFn: () => deleteAllEmployeeData(employee!.id),
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: `История и смены сборщика ${employee?.firstName} ${employee?.lastName} успешно удалены`,
      });
      refetchEmployeeHistoryAndShifts();
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении истории и смен сборщика',
        text: error.message,
      });
    }
  });

  const {
    mutate: archiveEmployeeMutation,
    isLoading: isArchiving,
  } = useAuthenticatedMutation({
    mutationKey: ['archiveEmployee', employee?.id],
    mutationFn: () => archiveEmployee(employee!.id),
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: `Сборщик ${employee?.firstName} ${employee?.lastName} успешно скрыт`,
      });
      onClose();
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при скрытии сборщика',
        text: error.message,
      });
    }
  });

  const {
    mutate: deleteEmployeeMutation,
    isLoading: isDeleting,
  } = useAuthenticatedMutation({
    mutationKey: ['deleteEmployee', employee?.id],
    mutationFn: () => deleteEmployeeMutationFn({
      id: employee!.id,
    }),
    onSuccess: () => {
      notification.open({
        type: 'success',
        title: `Сборщик ${employee?.firstName} ${employee?.lastName} успешно удален`,
      });
      onClose();
    },
    onError: (error: Error) => {
      notification.open({
        type: 'error',
        title: 'Ошибка при удалении сборщика',
        text: error.message,
      });
    }
  });

  const hasAnyData = useMemo(() => {
    if (!employeeHistoryAndShiftsData) {
      return false;
    }

    return employeeHistoryAndShiftsData.hasHistory || employeeHistoryAndShiftsData.hasShifts;
  }, [employeeHistoryAndShiftsData]);

  const hasNoData = useMemo(() => {
    if (!employeeHistoryAndShiftsData) {
      return false;
    }

    return !employeeHistoryAndShiftsData.hasHistory && !employeeHistoryAndShiftsData.hasShifts;
  }, [employeeHistoryAndShiftsData]);

  return (
    <Modal
      open={!!employee}
      onClose={onClose}
    >
      <Title>Удаление сборщика</Title>
      {
        employeeHistoryAndShiftsIsFetching && (
          <LoadingBox />
        )
      }
      {
        hasAnyData && employeeHistoryAndShiftsData && (
          <>
            <Alert severity="warning">
              {
                `Сборщик имеет ${[employeeHistoryAndShiftsData.hasHistory, employeeHistoryAndShiftsData.hasShifts].filter(Boolean).join(" и ")}. Удаление возможно только после удаления всех записей.`
              }<br />
              <strong>ВНИМАНИЕ!</strong> Удаление истории сборщика отразится на всех записях, где он участвовал и изменит итоговые суммы и статистику.
              <br />
              <br />
              Вместо удаления вы можете скрыть сборщика, нажав на кнопку "Скрыть", чтобы он не отображался в списках.
            </Alert>
            <ArchiveEmployee
              onClick={archiveEmployeeMutation}
              disabled={isArchiving}
            >
              Скрыть сборрщика {isArchiving && <CircularProgress size={20} />}
            </ArchiveEmployee>
            <DeleteAllEmplyeeData
              onClick={deleteAllEmployeeDataMutation}
              disabled={isDeletingAllEmployeeData || hasNoData}
            >
              Удалить всю историю и смены сборщика {isDeletingAllEmployeeData && <CircularProgress size={20} />}
            </DeleteAllEmplyeeData>
            <DeleteEmployee
              onClick={deleteEmployeeMutation}
              disabled={isDeleting || hasAnyData}
            >
              Удалить сборщика {isDeleting && <CircularProgress size={20} />}
            </DeleteEmployee>
          </>
        )
      }
      {
        hasNoData && (
          <>
            <Alert severity="info">
              Сборщик не имеет истории и смен. Вы можете удалить его без последствий.
              <br />
              <br />
              Также вы можете скрыть сборщика, нажав на кнопку "Скрыть", чтобы он не отображался в списках, но позже его можно будет восстановить.
            </Alert>
            <ArchiveEmployee
              onClick={archiveEmployeeMutation}
              disabled={isArchiving}
            >
              Скрыть сборщика {isArchiving && <CircularProgress size={20} />}
            </ArchiveEmployee>
            <DeleteEmployee
              onClick={deleteEmployeeMutation}
              disabled={isDeleting}
            >
              Удалить сборщика {isDeleting && <CircularProgress size={20} />}
            </DeleteEmployee>
          </>
        )
      }
    </Modal>
  );
}

export default DeleteModal;
