# 🚀 react-dynamic-form: Dynamic Forms Made Easy by [Mercury](https://mercuryjs.dev/) Community

react-dynamic-form is a powerful,lightweight form library for React applications that lets you create stunning, functional forms with minimal effort. Say goodbye to complex setups and hello to intuitive, responsive forms that just work.

## ✨ Features

- 🎨 **Beautiful UI out of the box**: Sleek, modern designs that adapt to your brand
- 🔧 **Easy customization**: Tailor forms to your exact needs with simple configuration
- 🛡️ **Built-in error handling**: Robust validation with clear, user-friendly error messages
- 📱 **Fully responsive**: Perfect on desktop, tablet, or mobile
- 🔌 **Plug and play**: Get started with just a few lines of code
- 🚦 **Smart submission handling**: Seamless form submissions with success and error states
- ⚛️ **React integration**: Seamlessly works with your React components and frameworks like Next.js

## 🚀 Quick Start
## Benefits
- Reusability: Create forms dynamically without rewriting the component logic.

- Formik & Yup Integration: Enables smooth form handling and validation out of the box.

- Customizable Styles: Fully customizable styling for labels, inputs, and containers.

- Validation: Supports validation for multiple input types using Yup and custom regex patterns.

- Dynamic Fields: You can add input fields like text, email, password, textarea, radio, checkbox, file upload, and more.

## Installation

Install react-dynamic-form using npm:

```bash
npm install @mercury-js/dynaforms
```

Or using yarn:

```bash
yarn add @mercury-js/dynaforms
```

or using pnpm

```bash
pnpm add @mercury-js/dynaforms
```

or using bun

```bash
bun add @mercury-js/dynaforms
```


## Imports

In your React component, import the necessary modules:

```typescript
import DynamicForm, { FormField } from "@mercury-js/dynaforms";
import "@mercury-js/dynaforms/dist/styles.css";
```

## Basic Usage

Here’s an example of how to use the DynamicForm component with basic fields:

```typescript
const formData = [
  {
    id: 1,
    label: "First Name",
    name: "firstName",
    type: "text",
    required: true,
    displayErrorMessage: true,
  },
  {
    id: 2,
    label: "Email",
    name: "email",
    type: "email",
    required: true,
    displayErrorMessage: true,
  },
];

const handleSubmit = (values) => {
  console.log(values);
};

export default function BasicFormExample() {
  return <DynamicForm formData={formData} onSubmitFun={handleSubmit} />;
}
```

In this example, the form renders two input fields: one for the first name and one for email. Upon submission, the form data is logged to the console.

## Props Table

The following table describes the props for the `DynamicForm` component:

| Prop Name             | Type                                                | Description                             |
| --------------------- | --------------------------------------------------- | --------------------------------------- |
| formDataFormField     | Array of form field objects                         | Defines the fields in the form.         |
| edit                  | boolean                                             | If true, the form will be in edit mode. |
| containerStyles       | { className?: string; style?: React.CSSProperties } | Styles for the entire form container.   |
| buttonStyles          | { className?: string; style?: React.CSSProperties } | Styles for the submit button.           |
| buttonContainerStyles | { className?: string; style?: React.CSSProperties } | Styles for the button container.        |
| onSubmit              | (values: Record&lt;string, any&gt;) =&gt; void      | Function to handle form submission.     |

## FormField Type

The `FormField` object has the following structure:

| Prop Name            | Type                                                                                                                     | Description                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| id                   | number                                                                                                                   | Unique identifier for each field.                             |
| label                | string                                                                                                                   | The label text for the field.                                 |
| name                 | string                                                                                                                   | The name attribute for the field, used for form values.       |
| type                 | "text" or"email" or"password" or "textarea" or "number" or "enum" or "time" or "date" or "checkbox" or "radio" or "file" | Input type for the field (e.g., text, email, radio).          |
| required             | boolean                                                                                                                  | If true, the field will be required.                          |
| disabled             | boolean                                                                                                                  | If true, the field will be disabled.                          |
| displayErrorMessage  | boolean                                                                                                                  | If true, the error message will be displayed below the field. |
| regexPattern         | string                                                                                                                   | Custom regex pattern for field validation.                    |
| value                | number or  string or boolean                                                                                             | Pre-filled value for the field.                               |
| options              | { label: string; value: string }\[\]                                                                                     | Options for enum or radio fields.                             |
| labelStyles          | { className?: string; style?: React.CSSProperties }                                                                      | Styles for the label element.                                 |
| inputStyles          | { className?: string; style?: React.CSSProperties }                                                                      | Styles for the input element.                                 |
| inputContainerStyles | { className?: string; style?: React.CSSProperties }                                                                      | Styles for the input container.                               |
| radioInputContainerStyles | { className?: string; style?: React.CSSProperties }                                                                      | Styles for the radio input container.                               |

## FormikProps

### What is `FormikProps`?
`FormikProps` is an interface provided by Formik, a popular form management library in React. It contains various methods, properties, and state data that allow you to control and interact with forms dynamically. Using FormikProps, you can manage form values, errors, touched states, validation, submission, and more.

### Key `FormikProps` Methods and Properties
Here are some important methods and properties available in FormikProps:

- ***`values`***: Stores the current values of all form fields.
- ***`errors`***: Stores error messages for each form field, updated based on validation.
- ***`touched`***: Tracks which fields have been touched (focused and blurred).
- ***`isSubmitting`***: Boolean indicating whether the form is currently being submitted.
- ***`handleSubmit`***: Function for handling form submission.
- ***`handleChange`***: Function for handling input changes.
- ***`handleBlur`***: Function for handling the blur event.
- ***`setFieldValue`***: Allows setting the value of a specific field programmatically.
- ***`setFieldError`***: Allows setting the error of a specific field programmatically.
- ***`resetForm`***: Resets the form to its initial state.

## Using `FormikProps` with `FormikRef`
`FormikRef` allows you to access and control the Formik form programmatically via a reference. This is useful when you need to interact with the form outside of the form's immediate component (e.g., submitting the form from an external button, resetting the form, etc.).

In the provided code, the form reference is handled using `useRef` to either assign an external `formikRef` passed as a prop or create an internal one if not provided. This way, the `FormikProps` instance can be accessed via this ref.

## Usage
```typescript
"use client";
import DynamicForm, { FormField } from "express-react-form";
import { FormikProps } from "formik";
import "express-react-form/dist/styles.css";
import { useRef } from "react";

function Page() {
  const formRef = useRef<FormikProps<any>>(null);
  // Function to handle form submission
  const handleFormSubmit = (values: any) => {
    console.log("Form Submitted with values:", values);
    // Reset form after submission
    formRef.current?.resetForm();
  };
  // Form fields data
  const formData: FormField[] = [
    {
      id: 1,
      label: "First Name",
      name: "firstName",
      type: "text",
      required: true,
      displayErrorMessage: true,
      inputContainerStyles: { className: "md:w-[400px] w-[200px] h-[100px]" },
      inputStyles: { className: "border-[yellow] rounded-[50px]" },
    },
    {
      id: 2,
      label: "Role",
      name: "role",
      type: "enum",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
      displayErrorMessage: true,
    },
  ];

  return (
    <div>

      {/* DynamicForm Component */}
      <DynamicForm
        formikRef={formRef}
        edit={true}
        formData={formData}
        onSubmitFun={handleFormSubmit}
      />

      {/* Manual submit button */}
      <button onClick={() => formRef.current?.submitForm()}>Submit</button>
    </div>
  );
}

export default Page;
```

## 🎛️ Customization

Tailor your form to perfection:

## 📄 License

React Dynamic Form is MIT licensed.

---

Ready to craft amazing forms? Get started with React Dynamic Form today! 🎉
