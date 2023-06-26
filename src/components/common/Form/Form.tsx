import {
  Button,
  CircularProgress,
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
import { FileUploader } from 'react-drag-drop-files';
import DroppableImageContainer from '../DroppableImageContainer/DroppableImageContainer';
import FetchSelect from '../FetchSelect/FetchSelect';
import React from 'react';
import getLocalDateTimeString from '../../../utils/getLocalDateTimeString';

const renderField = (
  ...[{
    name,
    label,
    type,
    ...rest
  }, {
    key,
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
    case 'fetch-select':
      const { fetchSelectConfig } = rest;

      if (!fetchSelectConfig) {
        throw new Error('fetchSelectConfig is required for fetch-select type');
      }

      const {
        queryFn,
        multiple,
        showInOption,
        showInValue,
        valueKey,
        backendSearch,
        preloadedValues: preselectedValues,
      } = fetchSelectConfig;

      fieldToRender = (
        <FetchSelect
          key={key}
          label={label}
          value={values[name]}
          onChange={(value) => setFieldValue(name, value)}
          queryFn={queryFn}
          multiple={multiple}
          backendSearch={backendSearch}
          showInOption={showInOption}
          showInValue={showInValue}
          valueKey={valueKey}
          preloadedValues={preselectedValues}
        />
      );
      break;
    case 'file':
      fieldToRender = (
        <React.Fragment key={key}>
          <label>{label}</label>
          <FileUploader
            handleChange={(file: File) => setFieldValue(name, file)}
            label="Перетащите изображение сюда или нажмите, чтобы выбрать"
            name={name}
            hoverTitle="Отпускайте"
            types={['JPG', 'PNG', 'GIF']}
          >
            <DroppableImageContainer image={values[name]} />
          </FileUploader>
        </React.Fragment>
      );
      break;
    case 'date':
    case 'datetime-local':
      fieldToRender = (
        <TextField
          {...rest}
          name={name}
          label={label}
          variant="outlined"
          onChange={(e) => {
            const localDateTimeString = e.target.value;

            const isOnlyDate = localDateTimeString.match(/^\d{4}-\d{2}-\d{2}$/);

            if (isOnlyDate) {
              const date = new Date(localDateTimeString);
              date.setHours(0, 0, 0, 0);
              setFieldValue(name, new Date(date));
              return;
            }

            setFieldValue(
              name,
              localDateTimeString ? new Date(localDateTimeString) : null
            );
          }}
          value={values[name] ? getLocalDateTimeString(values[name], type === 'date') : null}
          type={type}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
      break;
    case 'phone':
      fieldToRender = (
        <React.Fragment key={key}>
          <PhoneField
            key={key}
            country={'by'}
            onChange={(phoneNumber) => setFieldValue(name, '+' + phoneNumber)}
            value={values[name]}
            specialLabel={label}
          />
          {error && isTouched && <FormValidError>{error.toString()}</FormValidError>}
        </React.Fragment>
      );
      break;
    default:
      fieldToRender = (
        <React.Fragment key={key}>
          <TextField
            {...rest}
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
        </React.Fragment>
      );
      break;
  }

  return fieldToRender;
};

function Form<Vals extends FormikValues>(props: FormProps<Vals> & { className?: string }) {
  const initialValuesBasedOnFields = Object.fromEntries(props.fields.map((fieldData) => {
    const { name, type, fetchSelectConfig } = fieldData;

    switch (type) {
      case 'file':
        return [
          name,
          null
        ];
      case 'fetch-select':
        if (!fetchSelectConfig) {
          throw new Error('fetchSelectConfig is required for fetch-select type');
        }

        const {
          multiple,
        } = fetchSelectConfig;

        return [
          name,
          multiple ? [] : null
        ];
    }

    return [
      name,
      ''
    ];
  }
  )) as Vals;

  const {
    fields,
    submitText,
    initialValues = initialValuesBasedOnFields,
    loading,
    className,
    ...formikProps
  } = props;
  return (
    <Formik<Vals>
      {...{
        initialValues,
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
          className={className}
          onSubmit={handleSubmit}
        >
          {fields.map((fieldData, index) =>
            renderField(fieldData, {
              values,
              handleChange,
              setFieldValue,
              errors,
              touched,
              key: `${fieldData.name}-${index}`,
            })
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={Object.keys(errors).length > 0 || loading}
            endIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {submitText}
          </Button>
        </VerticalForm>
      )}
    </Formik>
  );
};

export default Form;
