import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { input, output, ZodType } from 'zod'

type FormSchema = ZodType<FieldValues, FieldValues>

type Options<T extends FormSchema> = UseFormProps<input<T>, unknown, output<T>> & {
  schema: T
}

export const useZodForm = <T extends FormSchema>({
  schema,
  ...options
}: Options<T>): UseFormReturn<input<T>, unknown, output<T>> =>
  useForm<input<T>, unknown, output<T>>({ ...options, resolver: zodResolver(schema) })
