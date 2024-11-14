/**
 * Custom hook to handle form errors by focusing on the first input field with an error.
 *
 * @template T - The type of form values.
 * @param {Form<T>} form - The form instance containing form fields and errors.
 * @returns {Object} - Returns an object with:
 *   - `formRef`: A reference to the form element.
 *
 * @example
 * const form = useForm(form); // effector-forms form
 * const { formRef } = useFormErrorFocus(form);
 *
 * return (
 *   <form ref={formRef}>
 *     <input name="username" />
 *     <input name="email" />
 *   </form>
 * );
 *
 * @description
 * This hook uses `formRef` to find and focus on the first input element with an error
 * whenever validation errors are present. It tracks error field names and automatically
 * updates focus to the first error field in the DOM when errors change.
 */
import { AnyFormValues, Form, useForm } from 'effector-forms';
import { useEffect, useRef } from 'react';

import { typedKeys } from './typedObject';

export function useFormErrorFocus<T extends AnyFormValues>(form: Form<T>) {
  const formRef = useRef<HTMLFormElement>(null);

  const { errors, fields } = useForm(form);

  const errorFieldNames = typedKeys(fields).reduce((acc, key) => {
    const fieldErrors = errors(key);

    if (fieldErrors.length) {
      acc.push(fields[key].name);
    }

    return acc;
  }, [] as string[]);

  useEffect(() => {
    if (errorFieldNames.length > 0 && formRef.current) {
      const firstErrorField = formRef.current.querySelector(
        `[name="${errorFieldNames[0]}"]`,
      ) as HTMLElement;

      firstErrorField?.focus();
    }
  }, [errorFieldNames]);

  return { formRef };
}
