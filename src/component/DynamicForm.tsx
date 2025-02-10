import "../styles.css";
import React, { useRef } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldProps,
  FormikProps,
} from "formik";
import * as Yup from "yup";
import _ from "lodash";
import { twMerge } from "tailwind-merge";
import Select from "react-select";

type MultiSelectOption = { value: string; label: string };

export interface FormField {
  id: number;
  label: string;
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "number"
    | "enum"
    | "time"
    | "date"
    | "checkbox"
    | "radio"
    | "file"
    | "multiselect";
  required: boolean;
  disabled?: boolean;
  displayErrorMessage: boolean;
  regexPattern?: string;
  value?: number | string | boolean | MultiSelectOption[];
  options?: MultiSelectOption[];
  labelStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  inputStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  inputContainerStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  radioInputContainerStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  watchField?: (value: any) => void;
}
interface DynamicFormProps {
  formData: FormField[];
  edit?: boolean;
  containerStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  buttonStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  buttonContainerStyles?: {
    className?: string;
    style?: React.CSSProperties;
  };
  onSubmitFun?: (values: Record<string, any>) => void;
  formikRef?: React.RefObject<FormikProps<any>>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formData,
  containerStyles = {},
  edit = false,
  buttonStyles = {},
  buttonContainerStyles = {},
  onSubmitFun = (values) => {},
  formikRef: externalFormRef,
}) => {
  const internalFormRef = useRef<FormikProps<any>>(null);
  const formikRef = externalFormRef || internalFormRef;

  const validationSchema = Yup.object().shape(
    formData.reduce((schema, field) => {
      let fieldValidation: any = Yup.string();
      switch (field.type) {
        case "email":
          fieldValidation = fieldValidation.email("Invalid email format");
          break;
        case "number":
          fieldValidation = Yup.number().typeError(
            `${field.label} must be a number`
          );
          break;
        case "password":
          fieldValidation = Yup.string();
          break;
        case "multiselect":
          fieldValidation = Yup.array().of(
            Yup.object().shape({
              value: Yup.string().required("Value is required"),
              label: Yup.string().required("Label is required"),
            })
          );
          break;
        case "date":
          fieldValidation = Yup.date();
          break;
        case "checkbox":
          fieldValidation = Yup.boolean()
          break;
        case "radio":
          fieldValidation = Yup.string().oneOf(
            field?.options?.map((option) => option.value) || [],
            `Please select a valid ${field.label}`
          );
          break;
      }

      if (field.required) {
        if (field.type === "multiselect") {
          fieldValidation = fieldValidation.min(
            1,
            `${field.label} is required`
          );
        } else
          fieldValidation = fieldValidation.required(
            `${field.label} is required`
          );
      }

      if (field.regexPattern) {
        fieldValidation = fieldValidation?.matches && fieldValidation.matches(
          new RegExp(field.regexPattern),
          `${field.label} is invalid`
        );
      }

      schema[field.name] = fieldValidation;
      return schema;
    }, {} as Record<string, Yup.AnySchema>)
  );

  const initialValues = formData.reduce((values, field) => {
    values[field.name] =
      edit && field.value !== undefined
        ? field.value
        : field.type === "checkbox"
        ? false
        : "";
    return values;
  }, {} as Record<string, string | number | boolean | MultiSelectOption[]>);

  const renderField = (fields: FormField) => {
    switch (fields.type) {
      case "textarea":
        return (
          <Field id={fields.name} name={fields.name}>
            {({ field, form: { touched, errors }, meta }: FieldProps) => (
              <div>
                <textarea
                  className={twMerge(
                    "h-[45px] w-[100%] rounded-xl border-2",
                    meta.touched && meta.error
                      ? "!border-[red]"
                      : "border-grayColor",
                    "pl-3",
                    fields?.inputStyles?.className
                  )}
                  style={fields?.inputStyles?.style}
                  disabled={fields?.disabled ?? false}
                  placeholder={`Enter ${fields?.label}`}
                  value={field.value}
                  onChange={(e: any) => {
                    typeof fields.watchField == "function" &&
                      fields.watchField(e?.target?.value);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
                {fields?.displayErrorMessage && meta.touched && meta.error && (
                  <div className="text-[12px] leading-[13.92px] ml-2 text-[red] mt-2">
                    {meta.error}
                  </div>
                )}
              </div>
            )}
          </Field>
        );

      case "enum":
        return (
          <Field id={fields.name} name={fields.name} as="select">
            {({ field, form: { touched, errors }, meta }: FieldProps) => (
              <div>
                <select
                  className={twMerge(
                    "h-[45px] w-[100%] rounded-xl border-2",
                    meta.touched && meta.error
                      ? "!border-[red]"
                      : "border-grayColor",
                    "pl-3",
                    fields?.inputStyles?.className
                  )}
                  style={fields?.inputStyles?.style}
                  disabled={fields?.disabled ?? false}
                  value={field.value}
                  onChange={(e: any) => {
                    typeof fields.watchField == "function" &&
                      fields.watchField(e?.target?.value);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  multiple={field.multiple}
                >
                  <option value="" disabled>
                    Select {fields.label}
                  </option>
                  {fields.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fields?.displayErrorMessage && meta.touched && meta.error && (
                  <div className="text-[12px] leading-[13.92px] ml-2 text-[red] mt-2">
                    {meta.error}
                  </div>
                )}
              </div>
            )}
          </Field>
        );

      case "multiselect":
        return (
          // <Field id={fields.name} name={fields.name} as="Select">
          //   {({ field, form: { touched, errors }, meta }: FieldProps) => (
          <div>
            <Select
              options={fields.options}
              className={twMerge(fields?.inputStyles?.className)}
              isDisabled={fields?.disabled ?? false}
              isMulti={true}
              name={fields.name}
              value={formikRef.current?.values[fields.name]}
              onChange={(val: any) => {
                typeof fields.watchField == "function" &&
                  fields.watchField(val);
                formikRef.current?.setFieldValue(fields.name, val);
              }}
              placeholder={`Select ${fields.label}`}
            />
            {fields?.displayErrorMessage &&
              formikRef.current?.touched?.[fields.name] &&
              formikRef.current.errors[fields.name] && (
                <div className="text-[12px] leading-[13.92px] ml-2 text-[red] mt-2">
                  {formikRef.current.errors[fields.name]?.toString()}
                </div>
              )}
          </div>
          //   )}
          // </Field>
        );

      case "radio":
        return (
          <Field id={fields.name} name={fields.name}>
            {({ field, meta }: FieldProps) => (
              <div
                className={twMerge(
                  `flex flex-col gap-1 h-[85px]`,
                  fields?.radioInputContainerStyles?.className
                )}
                style={fields?.radioInputContainerStyles?.style}
              >
                {fields.options?.map((option) => (
                  <label
                    key={option.value}
                    className="inline-flex items-center mr-3"
                  >
                    <input
                      type="radio"
                      className={twMerge(
                        `h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500`,
                        meta.touched && meta.error
                          ? "!border-[red]"
                          : "border-grayColor",
                        fields?.inputStyles?.className
                      )}
                      style={fields?.inputStyles?.style}
                      name={fields.name}
                      value={option.value}
                      checked={field.value === option.value}
                      disabled={fields?.disabled ? fields?.disabled : false}
                      onChange={(e) => {
                        typeof fields.watchField == "function" &&
                          fields.watchField(e?.target.value);
                        field.onChange(e);
                      }}
                    />
                    <span className="ml-2">{option.label}</span>
                  </label>
                ))}
                {fields?.displayErrorMessage && meta.touched && meta.error && (
                  <div className="text-[12px] leading-[13.92px] ml-2 text-[red]">
                    {meta.error}
                  </div>
                )}
              </div>
            )}
          </Field>
        );
      case "checkbox":
        return (
          <Field id={fields.name} name={fields.name}>
            {({ field, form: { touched, errors }, meta }: FieldProps) => (
              <div>
                <input
                  className={twMerge(
                    "h-[45px] w-[100%] rounded-xl",
                    fields?.type !== "file" && "border-2",
                    meta.touched && meta.error
                      ? "!border-[red]"
                      : "border-gray-700",
                    "pl-3",
                    fields?.inputStyles?.className
                  )}
                  disabled={fields?.disabled ?? false}
                  type={fields.type}
                  style={fields?.inputStyles?.style}
                  placeholder={`Enter ${fields?.label}`}
                  // value={field.value}
                  onChange={(e: any) => {
                    typeof fields.watchField == "function" &&
                      fields.watchField(e?.target?.value);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  checked={field.value}
                />
                {fields?.displayErrorMessage && meta.touched && meta.error && (
                  <div className="text-[12px] leading-[13.92px] ml-2 text-[red] mt-2">
                    {meta.error}
                  </div>
                )}
              </div>
            )}
          </Field>
        );
      default:
        return (
          <Field id={fields.name} name={fields.name}>
            {({ field, form: { touched, errors }, meta }: FieldProps) => (
              <div>
                <input
                  className={twMerge(
                    "h-[45px] w-[100%] rounded-xl",
                    fields?.type !== "file" && "border-2",
                    meta.touched && meta.error
                      ? "!border-[red]"
                      : "border-gray-700",
                    "pl-3",
                    fields?.inputStyles?.className
                  )}
                  disabled={fields?.disabled ?? false}
                  type={fields.type}
                  style={fields?.inputStyles?.style}
                  placeholder={`Enter ${fields?.label}`}
                  value={field.value}
                  onChange={(e: any) => {
                    typeof fields.watchField == "function" &&
                      fields.watchField(e?.target?.value);
                    field.onChange(e);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
                {fields?.displayErrorMessage && meta.touched && meta.error && (
                  <div className="text-[12px] leading-[13.92px] ml-2 text-[red] mt-2">
                    {meta.error}
                  </div>
                )}
              </div>
            )}
          </Field>
        );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        onSubmitFun(values);
      }}
      innerRef={formikRef}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} className="">
          <div
            style={containerStyles?.style}
            className={containerStyles?.className}
          >
            {formData.map((field) => (
              <div
                key={field.id}
                className={twMerge(
                  "flex flex-col gap-1 h-[85px]",
                  field?.inputContainerStyles?.className
                )}
                style={field?.inputContainerStyles?.style}
              >
                <label
                  htmlFor={field.name}
                  className={twMerge(
                    "text-[16px] font-semibold",
                    field?.labelStyles?.className
                  )}
                  style={field?.labelStyles?.style}
                >
                  {field.label}{" "}
                  {field.required && <span className="text-[red]">*</span>}
                </label>

                {renderField(field)}
                {/* {field.displayErrorMessage && (
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-[12px] leading-[13.92px] ml-2 text-[red]"
                  />
                )} */}
              </div>
            ))}
          </div>
          <div
            style={buttonContainerStyles?.style}
            className={buttonContainerStyles?.className}
          >
            <button
              type="submit"
              className={twMerge(
                "px-5 py-2 bg-blue-500 text-white rounded-md text-center font-semibold mt-2",
                buttonStyles?.className
              )}
              style={buttonStyles?.style}
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DynamicForm;
