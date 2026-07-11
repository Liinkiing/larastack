import type { ComponentPropsWithoutRef } from 'react'
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'

export interface FormProps<T extends FieldValues = FieldValues> extends Omit<
  ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> {
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
      <form
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
      </form>
    </FormProvider>
  )
}
