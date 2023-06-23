import { TextFieldProps } from "@mui/material";
import { FormikConfig, FormikErrors, FormikTouched, FormikValues } from "formik";
import * as Yup from 'yup';
import { PaginatedResponse, PaginationParams } from "../../../api/types/pagination";
import { DisplayedItem } from "../FetchSelect/FetchSelect";

export type FieldType = React.HTMLInputTypeAttribute
  | 'file'
  | 'select'
  | 'multiple-select'
  | 'fetch-select'
  | 'phone'

export interface FetchSelectConfig<
  TApiReturnItem
> {
  queryFn: (search: string, pagParams: PaginationParams) => Promise<PaginatedResponse<TApiReturnItem>>,
  multiple?: boolean,
  showInOption: DisplayedItem<TApiReturnItem>[],
  showInValue: DisplayedItem<TApiReturnItem>[],
  valueKey: keyof TApiReturnItem,
}

export interface FieldData extends Omit<TextFieldProps<'outlined'>, 'variant'> {
  name: string;
  type: FieldType;
  label: string;
  validation?: Yup.StringSchema<string | undefined>;
  fetchSelectConfig?: FetchSelectConfig<any>;
}

export type RenderFieldArgs = [
  field: FieldData,
  formikData: {
    key: string;
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
  initialValues?: Vals;
  loading?: boolean;
}
