import { Platform } from 'react-native';
import { isBase64 } from '../../../helpers';

export const generateImageSource = (src: number | string | undefined, defaultSrc: number | string | undefined, cacheMode: string): any => {
  if (!src) {
    return defaultSrc;
  }
  if (typeof src === 'string' && src.startsWith('http')) {
    return {
      uri: src,
      cache: cacheMode,
    };
  }
  if (typeof src === 'number' || src.uri) {
    return src;
  }
  if (Platform.OS !== 'web') {
    return { uri: src };
  }
  return src;
};
