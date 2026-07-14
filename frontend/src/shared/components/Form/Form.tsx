import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'

import { styled } from '~/styled-system/jsx'
import type { HTMLStyledProps } from '~/styled-system/types'

export interface FormProps<
  TInput extends FieldValues = FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TInput,
> extends Omit<HTMLStyledProps<'form'>, 'onSubmit'> {
  readonly form: UseFormReturn<TInput, TContext, TOutput>
  readonly resetValuesAfterSubmit?: boolean
  readonly onSubmit?: SubmitHandler<TOutput>
}

export const Form = <TInput extends FieldValues, TContext = unknown, TOutput extends FieldValues = TInput>({
  children,
  form,
  onSubmit,
  resetValuesAfterSubmit = true,
  ...props
}: FormProps<TInput, TContext, TOutput>) => {
  return (
    <FormProvider {...form}>
      <styled.form
        {...props}
        {...(onSubmit
          ? {
              onSubmit: form.handleSubmit(async (data, event) => {
                await onSubmit(data, event)
                if (resetValuesAfterSubmit) {
                  form.reset(form.getValues())
                }
              }),
            }
          : {})}
      >
        {children}
      </styled.form>
    </FormProvider>
  )
}
