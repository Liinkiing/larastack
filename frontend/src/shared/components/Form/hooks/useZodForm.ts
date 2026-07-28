import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { ZodType } from 'zod'

type Options<Input extends FieldValues, Output extends FieldValues> = UseFormProps<Input, unknown, Output> & {
  schema: ZodType<Output, Input>
}

export const useZodForm = <Input extends FieldValues, Output extends FieldValues>({
  schema,
  ...options
}: Options<Input, Output>): UseFormReturn<Input, unknown, Output> =>
  useForm<Input, unknown, Output>({
    ...options,
    resolver: zodResolver(schema),
  })
