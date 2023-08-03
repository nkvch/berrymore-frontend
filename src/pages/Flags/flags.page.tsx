import styled from '@emotion/styled';
import { Chip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useMemo } from 'react';
import * as Yup from 'yup';
import useAuthenticatedMutation from '../../api/auth/hooks/useAuthenticatedMutation';
import useAuthenticatedQuery from '../../api/auth/hooks/useAuthenticatedQuery';
import addFlag, { Flag } from '../../api/mutationFns/flags/addFlag';
import deleteFlag from '../../api/mutationFns/flags/deleteFlag';
import updateFlag from '../../api/mutationFns/flags/updateFlag';
import getFlags, { FlagItem } from '../../api/queryFns/flags.query';
import { notification } from '../../components/Notifications/Notifications';
import Form from '../../components/common/Form/Form';
import LoadingBox from '../../components/common/LoadingBox/LoadingBox';
import Modal from '../../components/common/Modal/Modal';
import authorized from '../../helpers/withAuth';
import withDefaultProps from '../../helpers/withDefaultProps';

const ColorableChip = styled(Chip)<{
  bgcolor: string;
}>`
  background-color: ${({ bgcolor }) => bgcolor};
  color: white;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: ${({ bgcolor }) => bgcolor}55;
  }
`;

const ChipsHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Title = styled(withDefaultProps({ variant: 'h6' }, Typography))`
  margin-bottom: 20px;
`;

const ButtonHolder = styled.div`
  margin-top: 20px;
`;

interface DeletableAndUpdatableChipProps {
  label: string;
  onDelete: () => void;
  onUpdate: () => void;
  bgcolor: string;
}

interface AddFlagModalProps {
  onClose: () => void;
  open: boolean;
}

const AddFlagModal: React.FC<AddFlagModalProps> = ({ onClose, open }) => {
  const { mutate: addFlagMutation, isLoading: isAdding } =
    useAuthenticatedMutation({
      mutationFn: addFlag,
      onSuccess: () => {
        onClose();
        notification.open({
          title: 'Метка добавлена',
          type: 'success',
        });
      },
    });

  return (
    <Modal open={open} onClose={onClose}>
      <Title>Добавить метку</Title>
      <Form<Flag>
        fields={[
          {
            name: 'name',
            label: 'Название',
            type: 'text',
            validation: Yup.string().required(
              'Это поле обязательно для заполнения'
            ),
          },
          {
            name: 'color',
            label: 'Цвет',
            type: 'color',
            defaultValue: '#45c20c',
            validation: Yup.string().required(
              'Это поле обязательно для заполнения'
            ),
          },
        ]}
        onSubmit={(data) => {
          addFlagMutation(data);
        }}
        loading={isAdding}
        submitText="Добавить"
      />
    </Modal>
  );
};

interface UpdateFlagModalProps {
  onClose: () => void;
  open: boolean;
  flag: FlagItem;
}

const UpdateFlagModal: React.FC<UpdateFlagModalProps> = ({
  onClose,
  open,
  flag,
}) => {
  const { mutate: updateFlagMutation, isLoading: isAdding } =
    useAuthenticatedMutation({
      mutationFn: (data: Flag) => updateFlag({ ...data, id: flag.id }),
      onSuccess: () => {
        onClose();
        notification.open({
          title: 'Метка обновлена',
          type: 'success',
        });
      },
    });

  return (
    <Modal open={open} onClose={onClose}>
      <Title>Обновить метку</Title>
      {flag && (
        <Form<Flag>
          fields={[
            {
              name: 'name',
              label: 'Название',
              type: 'text',
              defaultValue: flag?.name,
              validation: Yup.string().required(
                'Это поле обязательно для заполнения'
              ),
            },
            {
              name: 'color',
              label: 'Цвет',
              type: 'color',
              defaultValue: flag?.color,
              validation: Yup.string().required(
                'Это поле обязательно для заполнения'
              ),
            },
          ]}
          initialValues={{
            name: flag?.name,
            color: flag?.color,
          }}
          onSubmit={(data) => {
            updateFlagMutation(data);
          }}
          loading={isAdding}
          submitText="Добавить"
        />
      )}
    </Modal>
  );
};

const DeletableAndUpdatableChip = (props: DeletableAndUpdatableChipProps) => {
  return (
    <ColorableChip
      label={props.label}
      onDelete={props.onDelete}
      onClick={props.onUpdate}
      bgcolor={props.bgcolor}
      clickable
    />
  );
};

const FlagsPage: React.FC = () => {
  const [isAddFlagModalOpen, setIsAddFlagModalOpen] = React.useState(false);
  const [editingFlag, setEditingFlag] = React.useState<FlagItem | null>(null);

  const { data, isFetching, refetch } = useAuthenticatedQuery(['flags'], () =>
    getFlags('', { page: 1, perPage: 999 })
  );

  const { mutate: deleteFlagMutation, isLoading: isDeleting } =
    useAuthenticatedMutation({
      mutationFn: deleteFlag,
      onSuccess: () => {
        notification.open({
          title: 'Метка удалена',
          type: 'success',
        });
        refetch();
      },
    });

  const flags = useMemo(() => {
    if (data) {
      return data.items;
    }
    return [];
  }, [data]);

  return (
    <>
      {isFetching || isDeleting ? (
        <LoadingBox />
      ) : (
        <ChipsHolder>
          {flags.map((flag) => (
            <DeletableAndUpdatableChip
              key={flag.id}
              label={flag.name}
              onDelete={() => {
                deleteFlagMutation(flag.id);
              }}
              onUpdate={() => {
                setEditingFlag(flag);
              }}
              bgcolor={flag.color}
            />
          ))}
        </ChipsHolder>
      )}
      <AddFlagModal
        onClose={() => {
          setIsAddFlagModalOpen(false);
          refetch();
        }}
        open={isAddFlagModalOpen}
      />
      <UpdateFlagModal
        onClose={() => {
          setEditingFlag(null);
          refetch();
        }}
        open={!!editingFlag}
        flag={editingFlag!}
      />
      <ButtonHolder>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsAddFlagModalOpen(true);
          }}
        >
          Добавить
        </Button>
      </ButtonHolder>
    </>
  );
};

export default authorized(FlagsPage);
