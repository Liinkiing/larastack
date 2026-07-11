type ControlOption = { type: 'radio' | 'inline-radio' | 'select' | 'boolean' }

export const generateVariantArgTypes = <V extends Record<string, ReadonlyArray<boolean | string>>>(
  variants: V,
  options?: Partial<Record<keyof V, ControlOption>>,
) => {
  const result: Record<string, { options: ReadonlyArray<boolean | string>; control: ControlOption }> = {}
  for (const [key, values] of Object.entries(variants)) {
    const control: ControlOption =
      options?.[key] ?? (values.includes(true) ? { type: 'boolean' } : { type: 'inline-radio' })
    result[key] = {
      control,
      options: values,
    }
  }

  return result
}

export const disableArgTypes = (types: string[]) => {
  const result: Record<string, { table: { disable: boolean }; control: { disable: boolean } }> = {}

  for (const type of types) {
    result[type] = { control: { disable: true }, table: { disable: true } }
  }

  return result
}
