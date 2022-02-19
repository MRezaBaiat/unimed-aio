import store from '../redux/Store';
import { ChatType, User, UserType } from 'api';
import Kit, { smartDate } from 'javascript-dev-kit';
import { Linking, Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import React from 'react';
import * as Device from 'expo-device';
import Storage from './Storage';
import { DeviceType } from 'expo-device';
import axios, { AxiosError } from 'axios';

export function replaceArabicChars(text: string) {
  if (!text) {
    return text;
  }
  return text.replaceAll('ﻲ', 'ﻰ').replaceAll('ﻱ', 'ی').replaceAll('ﺔ', 'ـه').replaceAll('ﺓ', 'ه');
}

export const childrenWithProps = (props, children) => {
  return React.Children.map(children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });
};

export function addFavoriteDoctor(doctor: User) {
  const doctors = getFavoriteDoctors();
  // @ts-ignore
  doctors.removeValue(doctors.find((d) => d._id === doctor._id));
  doctors.push(doctor);
  while (doctors.length > 5) {
    doctors.removeValue(doctors[0]);
  }
  Storage.set('favorite-doctors', JSON.stringify(doctors));
}

export function getFavoriteDoctors(): User[] {
  return JSON.parse(Storage.get('favorite-doctors') || '[]').map((item) => {
    item.isFromFavourite = true;
    return item;
  });
}

export const ping = (url: string, timeout = 6000): Promise<number | false> => {
  if (url.startsWith('turn:')) {
    url = url.split('turn:')[1];
  }
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  const address = new URL(url);
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'web') {
        // https://github.com/jayantbh/ping-stats
        const start = window.performance.now();
        fetch(address.hostname, { method: 'head', mode: 'no-cors', cache: 'no-cache' })
          .then(() => resolve(window.performance.now() - start))
          .catch((e) => {
            console.warn(e);
            resolve(false);
          });
      } else {
        // https://github.com/RoJoHub/react-native-ping
        const start = new Date().getTime();
        axios
          .get(address.hostname, { method: 'head', headers: { 'Access-Control-Allow-Origin': '*', cache: 'no-cache' } })
          .then(() => resolve(new Date().getTime() - start))
          .catch((e: AxiosError) => {
            if (e.response) {
              return resolve(new Date().getTime() - start);
            }
            console.warn(e);
            resolve(false);
          });
      }
      setTimeout(() => {
        resolve(false);
      }, timeout);
    } catch (e) {
      console.log(e);
      resolve(false);
    }
  });
};

export const getDeviceInfo = async (gatherIP = true) => {
  try {
    const deviceInfo: any = {};
    for (const key in Device) {
      if (typeof Device[key] !== 'function' && key !== 'DeviceType') {
        deviceInfo[key] = Device[key];
      } else if (typeof Device[key] === 'function') {
        try {
          deviceInfo[key] = await Device[key]();
        } catch (e) {} // dont log , could cause circular
      }
    }
    switch (deviceInfo.getDeviceTypeAsync) {
      case DeviceType.UNKNOWN:
        deviceInfo.deviceType = 'UNKNOWN';
        break;
      case DeviceType.TV:
        deviceInfo.deviceType = 'TV';
        break;
      case DeviceType.TABLET:
        deviceInfo.deviceType = 'TABLET';
        break;
      case DeviceType.PHONE:
        deviceInfo.deviceType = 'PHONE';
        break;
      case DeviceType.DESKTOP:
        deviceInfo.deviceType = 'DESKTOP';
        break;
    }
    try {
      if (gatherIP) {
        const res = await fetch('https://api.bigdatacloud.net/data/client-ip', { method: 'GET' });
        deviceInfo.ipInfo = await res.json();
      }
    } catch (e) {} // dont log , could cause circular
    return deviceInfo;
  } catch (e) {
    return undefined;
  }
};

export const openViewer = (filePath: string) => {
  window.open(filePath, '_blank');
};

export const callIntent = (phone: string) => {
  const url = `tel://${phone}`;
  Linking.openURL(url);
};

export const isBase64 = (text: string): boolean => {
  return !!(text && text.match(/^data:/));
};

export const openURL = (url: string, target = '_blank') => {
  if (Platform.OS === 'web') {
    if (target === '_self') {
      Linking.openURL(url);
    } else {
      window.open(url, target);
    }
  } else {
    Linking.openURL(url);
  }
};

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/*
export const isMobileBrowser = () => {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
*/

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
export const mimeFromChatType = (type: ChatType) => {
  switch (type) {
    case ChatType.GIF:
      return 'image/gif';
    case ChatType.IMAGE:
      return 'image/jpeg';
    case ChatType.MUSIC:
      return 'audio/mpeg';
    case ChatType.PDF:
      return 'application/pdf';
    case ChatType.TEXT:
      return 'text/plain';
    case ChatType.UNKNOWN:
      return 'application/octet-stream';
    case ChatType.VIDEO:
      return 'video/mp4';
  }
};

export const formatDate = (date: string) => {
  return date; //TODO
};

export const formatDateShamsi = (date: string) => {
  return Kit.numbersToPersian(smartDate(date).formatJalali('HH:mm - YYYY/M/D'));
};

export const numberWithCommas = (number) => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const getMyUserId = () => {
  const user = store.getState().userReducer.user;
  return user && user._id;
};

export const getMyUserType = (): UserType => {
  return store.getState().userReducer.user ? store.getState().userReducer.user.type : undefined;
};

/* String.prototype.replaceAll = function(str1, str2, ignore)
{
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} */

// const mReservedChars = [String.fromCharCode(92),'http://', 'https://', '/', '|', '?', '*', '<', '"', ':', '>', '.'];
export const generateNameFromUrl = (url: string) => {
  url = decodeURIComponent(url);
  url = url.replace('http://', '').replace('https://', '').replaceAll('/', '_').replaceAll(String.fromCharCode(92), '_').replaceAll('|', '_').replaceAll('?', '_').replaceAll('*', '_').replaceAll('<', '_').replaceAll('>', '_').replaceAll('"', '_').replaceAll(':', '_');

  /* if (Platform.OS !== 'web') {
    const splitted = url.split('.');
    const extension = splitted[splitted.length - 1];
    console.log('mmmm',splitted);
    url = url.replaceAll('.', '_');
    url = url + (extension || '');
  } else {
    url = url.replaceAll('.', '_');
  } */

  /* url = url.replace('http://', '')
    .replace('https://', '')
    .replaceAll('/', '_')
    .replaceAll(String.fromCharCode(92), '_'); */
  /* mReservedChars.forEach((c) => {
    // url = url.replaceAll(c, '_');
    url = url.replace(`/${c}/g`, '_');
  }); */
  console.log('returning', url);
  return url;
};

export const safeAssignStyles = (style: StyleProp<ViewStyle | TextStyle>, ...toAdd: StyleProp<ViewStyle | TextStyle>[]) => {
  const newStyle = {};
  if (Array.isArray(style)) {
    style.forEach((st) => {
      Object.assign(newStyle, st);
    });
  } else {
    Object.assign(newStyle, style);
  }

  if (!toAdd) {
    return newStyle;
  }

  toAdd.forEach((star) => {
    if (Array.isArray(star)) {
      star.forEach((st) => {
        Object.assign(newStyle, st);
      });
    } else {
      Object.assign(newStyle, star);
    }
  });
  return newStyle;
};
