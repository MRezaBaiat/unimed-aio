import { Platform, ViewStyle } from 'react-native';

export default {
  nonSelectable:
    Platform.OS === 'web' &&
    ({
      userSelect: 'none',
      pointerEvents: 'none',
    } as ViewStyle),
};
