type StyleRecipe = {
  variantMap: Record<string, unknown>
  variantKeys: string[]
}

type ControlOption = { type: 'radio' | 'inline-radio' | 'select' | 'boolean' }

export const generatePandaVariantsArgTypes = <R extends StyleRecipe>(
  recipe: R,
  options?: Partial<Record<keyof R['variantMap'], ControlOption>>,
) => {
  const result: Record<string, { options: string[]; control: ControlOption }> = {}
  for (const key of recipe.variantKeys) {
    const variantMap = recipe.variantMap[key] as string[]

    const control: ControlOption =
      options?.[key] || variantMap.includes('true') ? { type: 'boolean' } : { type: 'inline-radio' }
    result[key] = {
      control,
      options: variantMap,
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
