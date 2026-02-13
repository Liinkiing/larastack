import * as Device from 'expo-device'

export const getDeviceName = (): string => {
  const appPlatform = process.env.EXPO_OS ?? 'mobile'
  const rawDeviceName = Device.modelName?.trim() || Device.deviceName?.trim() || Device.modelName?.trim()

  if (!rawDeviceName) {
    return `expo-${appPlatform}`
  }

  return `${rawDeviceName} (${appPlatform} ${Device.osVersion})`.slice(0, 100)
}
