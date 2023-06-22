import {
  Button,
  TextField
} from '@mui/material';
import { Formik, FormikValues } from 'formik';
// import DroppableImageContainer from './DroppableImageContainer';
// import styles from '../../styles/Form.module.scss';
// import FetchSelect from './FetchSelect';
import 'react-phone-input-2/lib/material.css';
// import getLocalDateTimeString from '../utils/getLocalDateTimeString';
import FormValidError from '../../elements/FormValidError';
import { PhoneField, VerticalForm } from './elements';
import { FormProps, RenderFieldArgs } from './types';
import * as Yup from 'yup';

const renderField = (
  ...[{
    name,
    label,
    type,
    ...rest
  }, {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
  }]: RenderFieldArgs
) => {

  const error = errors[name];
  const isTouched = touched[name];

  let fieldToRender;

  switch (type) {
    case 'phone':
      fieldToRender = (
        <>
          <PhoneField
            country={'by'}
            onChange={(phoneNumber) => setFieldValue(name, '+' + phoneNumber)}
            value={values[name]}
            specialLabel={label}
          />
          {error && isTouched && <FormValidError>{error.toString()}</FormValidError>}
        </>
      );
      break;
    default:
      fieldToRender = (
        <>
          <TextField
            key={name}
            name={name}
            label={label}
            onChange={handleChange}
            value={values[name]}
            type={type}
            variant='outlined'
            multiline={type === 'textarea'}
            minRows={type === 'textarea' ? 3 : undefined}
            {...rest}
          />
          {error && isTouched && <FormValidError>{error.toString()}</FormValidError>}
        </>
      );
      break;
  }

  return fieldToRender;
};

function Form<Vals extends FormikValues>(props: FormProps<Vals>) {
  const {
    fields,
    submitText,
    ...formikProps
  } = props;
  return (
    <Formik<Vals>
      {...{
        initialValues: fields.reduce((acc, { name, defaultValue }) => ({
          ...acc,
          [name]: defaultValue || '',
        }), {} as Vals),
        validationSchema: Yup.object().shape(fields.reduce((acc, { name, validation }) => ({
          ...acc,
          [name]: validation,
        }), {} as Record<keyof Vals, any>)),
        ...formikProps,
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
      }) => (
        <VerticalForm
          onSubmit={handleSubmit}
        >
          {fields.map((fieldData) =>
            renderField(fieldData, {
              values,
              handleChange,
              setFieldValue,
              errors,
              touched,
            })
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={Object.keys(errors).length > 0}
          >
            {submitText}
          </Button>
        </VerticalForm>
      )}
    </Formik>
  );
};

export default Form;
