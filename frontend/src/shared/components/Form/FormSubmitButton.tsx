import type { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import type { ButtonProps } from '~/ui/button'
import { Button } from '~/ui/button'

type SubmitButtonProps = Omit<ButtonProps, 'disabled' | 'isDisabled'> & {
  forceDisable?: boolean
}

export const FormSubmitButton: FC<SubmitButtonProps> = ({ children, forceDisable = false, ...props }) => {
  const form = useFormContext()

  if (!form) {
    throw new Error('<SubmitButton/> must be used within a <Form/> component')
  }

  const { isSubmitting } = form.formState

  return (
    <Button type="submit" {...props} disabled={forceDisable || isSubmitting}>
      {children}
    </Button>
  )
}
