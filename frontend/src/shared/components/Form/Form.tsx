import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'

import { styled } from '~/styled-system/jsx'
import type { HTMLStyledProps } from '~/styled-system/types'

export interface FormProps<T extends FieldValues = any> extends Omit<HTMLStyledProps<'form'>, 'onSubmit'> {
  readonly form: UseFormReturn<T>
  readonly resetValuesAfterSubmit?: boolean
  readonly onSubmit?: SubmitHandler<T>
}

export const Form = <T extends FieldValues>({
  children,
  form,
  onSubmit,
  resetValuesAfterSubmit = true,
  ...props
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <styled.form
        {...props}
        {...(onSubmit
          ? {
              onSubmit: form.handleSubmit(async (data, event) => {
                await onSubmit(data, event)
                if (resetValuesAfterSubmit) {
                  form.reset(data)
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
