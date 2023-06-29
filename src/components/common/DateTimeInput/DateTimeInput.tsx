import { TextField, TextFieldProps } from "@mui/material";
import getLocalDateTimeString from "../../../utils/getLocalDateTimeString";

function DateTimeInput(props: TextFieldProps & {
  onChangeValue: (value?: Date) => void;
  value?: Date;
}) {
  const {
    type,
    onChangeValue,
    value,
  } = props;

  return (
    <TextField
      {...props}
      variant="outlined"
      onChange={(e) => {
        const localDateTimeString = e.target.value;

        const isOnlyDate = localDateTimeString.match(/^\d{4}-\d{2}-\d{2}$/);

        if (isOnlyDate) {
          const date = new Date(localDateTimeString);
          date.setHours(0, 0, 0, 0);
          onChangeValue(new Date(date));
          return;
        }

        onChangeValue(
          localDateTimeString ? new Date(localDateTimeString) : undefined
        );
      }}
      value={value ? getLocalDateTimeString(value, type === 'date') : null}
      type='datetime-local'
      InputLabelProps={{
        shrink: true,
      }}
    />
  )
}

export default DateTimeInput;
