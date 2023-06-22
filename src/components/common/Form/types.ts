import { TextFieldProps } from "@mui/material";
import { FormikConfig, FormikErrors, FormikTouched, FormikValues } from "formik";
import * as Yup from 'yup';

export type FieldType = React.HTMLInputTypeAttribute
  | 'file'
  | 'select'
  | 'multiple-select'
  | 'fetch-select'
  | 'phone'

export interface FieldData extends Omit<TextFieldProps<'outlined'>, 'variant'> {
  name: string;
  type: FieldType;
  label: string;
  defaultValue?: string;
  validation?: Yup.StringSchema<string | undefined>;
}

export type RenderFieldArgs = [
  field: FieldData,
  formikData: {
    values: FormikValues;
    errors: FormikErrors<FormikValues>;
    touched: FormikTouched<FormikValues>;
    handleChange: (e: React.ChangeEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<FormikValues>>
  }
]

export interface FormProps<Vals> extends Omit<FormikConfig<Vals>, 'initialValues'> {
  fields: FieldData[];
  submitText: string;
}
