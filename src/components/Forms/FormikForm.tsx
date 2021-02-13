/*
 * Blue1984 - Twitter without censorship
 * Copyright (c) 2020. Mikhail Lazarev
 * https://github.com/MikaelLazarev/blue1984-server
 *
 */

import React from "react";
import { Button, FormLabel } from "react-bootstrap";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from "formik";
import * as yup from "yup";
import AutoCompleteField, { TypeaheadOptions } from "./AutoCompleteField";

export interface FieldI {
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "autocomplete" | "markdown";
  options?: TypeaheadOptions[];
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export interface FormikFormViewProps<T> {
  data?: T;
  onSubmit: (values: T) => void;
  isSubmitted: boolean;
}

interface FormikFormProps<T, S> {
  formSchema: yup.ObjectSchema;
  fields: { [T in keyof yup.InferType<S>]: FieldI };
  initialValues: T;
  onSubmit: (values: T) => void;
  onChange?: (event?: React.FormEvent<HTMLFormElement>) => void;
  isSubmitted: boolean;
}

type FieldComponent =
  | string
  | React.ComponentType
  | React.ForwardRefExoticComponent<any>;

export function FormikForm<T, S>({
  formSchema,
  fields,
  initialValues,
  onChange,
  onSubmit,
  isSubmitted,
}: FormikFormProps<T, S>): React.ReactElement {
  function getComponent(
    name: string,
    f: FieldI,
    { setFieldValue, values }: FormikProps<T>
  ): React.ReactElement {
    switch (f.type) {
      default:
      case "input":
      case "textarea":
        return (
          <Field
            placeholder={f.placeholder || f.label}
            name={name}
            component={f.type || "input"}
            disabled={f.disabled}
          />
        );
      case "autocomplete":
        return (
          <AutoCompleteField
            name={name}
            label={f.label}
            placeholder={f.placeholder || f.label}
            data={f.options || []}
            onChange={(value: string) => {
              if (f.onChange) {
                f.onChange(value);
              }
              setFieldValue(name, value);
            }}
          />
        );
    }
  }

  const fieldsRendered = (props: FormikProps<T>) =>
    Object.entries(fields).map((e) => {
      const name = e[0];
      const f = e[1] as FieldI;
      console.log(props);
      return (
        <>
          <FormLabel>{f?.label}</FormLabel>
          {getComponent(name, f, props)}
          <ErrorMessage name={name} component="div" className="feedback" />
        </>
      );
    });

  return (
    <div className="container pd-x-0 pd-lg-x-10 pd-xl-x-0 m-t-20-f pd-t-30-f">
      <hr />
      <Formik
        validationSchema={formSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {(props: FormikProps<T>) => (
          <Form style={{display: "flex", flexDirection: "column"}} onBlur={onChange}>
            {fieldsRendered(props)}
            <Button
              type={"submit"}
              style={{marginTop: "10px"}}
              disabled={isSubmitted}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
