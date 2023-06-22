import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton, Snackbar, SnackbarProps } from '@mui/material';
import { ReactElement, useState } from 'react';
// import styles from '../../styles/Notification.module.scss';

interface NotificationInterface {
  open: (params: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    text?: string;
    time?: number;
  }) => string;
  close: (key: string) => void;
}

const notification: NotificationInterface = {
  open: () => '',
  close: () => { },
};

const Notifications = () => {
  const [snackBars, setSnackBars] = useState<{
    key: string;
    content: ReactElement<SnackbarProps>;
  }[]>([]);

  const open: NotificationInterface['open'] = ({ type, title, text, time }) => {
    const key = `notification${Math.random()}`;

    window.scrollTo(0, 0);

    setSnackBars([{
      key,
      content: (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => close(key)}
          key={key}
        >
          <Alert
            severity={type}
            action={<IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => close(key)}
            >
              <Close fontSize="small" />
            </IconButton>}
          >
            <AlertTitle>{title}</AlertTitle>
            {text}
          </Alert>
        </Snackbar>
      ),
    }, ...snackBars]);

    setTimeout(() => {
      close(key);
    }, time || 5000);

    return key;
  };

  const close: NotificationInterface['close'] = key => {
    setSnackBars(active => active.filter(notification => notification.key !== key));
  };

  notification.open = open;
  notification.close = close;

  return (
    <>
      {snackBars.map(notification => notification.content)}
    </>
  );
};

export { notification };

export default Notifications;
