type ControlOption = { type: 'radio' | 'inline-radio' | 'select' | 'boolean' }

export const generateVariantArgTypes = (
  variants: Record<string, readonly string[]>,
  options?: Record<string, ControlOption>,
) => {
  const result: Record<string, { options: string[]; control: ControlOption }> = {}
  for (const [key, variantMap] of Object.entries(variants)) {
    const values = [...variantMap]

    const control: ControlOption =
      options?.[key] ?? (values.includes('true') ? { type: 'boolean' } : { type: 'inline-radio' })
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
