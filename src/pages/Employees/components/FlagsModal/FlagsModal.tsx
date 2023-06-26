import { GridRowId } from "@mui/x-data-grid";
import useAuthenticatedMutation from "../../../../api/auth/hooks/useAuthenticatedMutation";
import bulkUpdateEmployeesMutationFn, { BulkUpdateEmployeesDto } from "../../../../api/mutationFns/employees/bulk-update.mutation";
import getFlags from "../../../../api/queryFns/flags.query";
import { notification } from "../../../../components/Notifications/Notifications";
import Form from "../../../../components/common/Form/Form";
import { FieldData } from "../../../../components/common/Form/types";
import Modal from "../../../../components/common/Modal/Modal";
import { ModalContent, ModalTitle } from "./elements";


interface FlagsModalProps {
  selected: GridRowId[];
  onClose: () => void;
}

const flagsFormFields: FieldData[] = [
  {
    name: 'setFlags',
    label: 'Выберите метки которые хотите установить',
    type: 'fetch-select',
    fetchSelectConfig: {
      multiple: true,
      queryFn: getFlags,
      showInOption: [{
        key: 'name',
        type: 'text',
      }],
      showInValue: [{
        key: 'name',
        type: 'text',
      }],
      valueKey: 'id',
    }
  },
  {
    name: 'removeFlags',
    label: 'Выберите метки которые хотите убрать',
    type: 'fetch-select',
    fetchSelectConfig: {
      multiple: true,
      queryFn: getFlags,
      showInOption: [{
        key: 'name',
        type: 'text',
      }],
      showInValue: [{
        key: 'name',
        type: 'text',
      }],
      valueKey: 'id',
    }
  }
];

function FlagsModal(props: FlagsModalProps) {
  const {
    selected,
    onClose,
  } = props;

  const {
    mutate: updateEmployeesFlags,
    isLoading
  } = useAuthenticatedMutation({
    mutationFn: bulkUpdateEmployeesMutationFn,
    onSuccess: () => {
      notification.open({
        title: 'Метки успешно установлены',
        type: 'success',
      });
      onClose();
    },
    onError: (err: any) => {
      notification.open({
        title: 'Ошибка при установке меток',
        type: 'error',
        text: err.message,
      });
    }
  })

  return (
    <Modal
      open
      onClose={onClose}
    >
      <ModalTitle>Установить флаги</ModalTitle>
      <ModalContent>
        <Form<Omit<BulkUpdateEmployeesDto, 'ids'>>
          fields={flagsFormFields}
          onSubmit={(data) => updateEmployeesFlags({
            ids: selected as number[],
            ...data,
          })}
          submitText="Сохранить"
          loading={isLoading}
        />
      </ModalContent>
    </Modal>
  );
}

export default FlagsModal;
