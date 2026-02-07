import RNAnimated, { createAnimatedComponent } from 'react-native-reanimated'

import * as TW from './index'

export const Animated = {
  ...RNAnimated,
  View: createAnimatedComponent(TW.View),
}
