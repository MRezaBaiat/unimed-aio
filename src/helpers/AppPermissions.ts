import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

enum PermissionTypes {
  audio = 'audio',
  video = 'video',
}

export default class AppPermissions {
  public static hasMicPermission = false;
  public static hasCameraPermission = false;
  private static askPermissionsPromise: Promise<boolean> | undefined;

  public static async checkPermissions(): Promise<boolean> {
    if (this.hasMicPermission && this.hasCameraPermission) {
      console.log('permissions', 'already granted');
      return true;
    }

    await this.getPermissions(PermissionTypes.audio, PermissionTypes.video);

    if (!this.hasMicPermission || !this.hasCameraPermission) {
      console.log('permissions, atleast one failed');
      console.warn('one of mic or camera permissions were denied');
      this.alertNoPermission();
      return false;
    }
    console.log('permissions all done');
    return true;
  }

  private static async permissionsGranted(...types: PermissionTypes[]) {
    if (types.includes(PermissionTypes.audio)) {
      this.hasMicPermission = true;
    }
    if (types.includes(PermissionTypes.video)) {
      this.hasCameraPermission = true;
    }
  }

  private static async getPermissions(...types: PermissionTypes[]): Promise<boolean> {
    if ((types.includes(PermissionTypes.video) && !this.hasCameraPermission) || (types.includes(PermissionTypes.audio) && !this.hasMicPermission)) {
      if (this.askPermissionsPromise) {
        return this.askPermissionsPromise.then(() => this.getPermissions(...types));
      }
      return this.createAskPermissionsAsync(...types);
    }
    return true;
  }

  private static createAskPermissionsAsync(...types: PermissionTypes[]): Promise<boolean> {
    console.log('permissions', 'creating promise for ' + types);
    this.askPermissionsPromise = new Promise<boolean>((resolve, reject) => {
      if (Platform.OS === 'web') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          return resolve(false);
        }
        if (document.readyState !== 'complete') {
          return window.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
              this.createAskPermissionsAsync(...types).then(resolve);
            }
          });
        }
        console.log('permissions', 'trying');
        navigator.mediaDevices
          .getUserMedia({ video: types.includes(PermissionTypes.video), audio: types.includes(PermissionTypes.audio) })
          .then((s) => {
            s.getTracks().forEach((s) => s.stop());
          })
          .then(() => resolve(true))
          .catch(reject);
      } else {
        const permissions: any[] = [];
        types.includes(PermissionTypes.audio) && permissions.push(Permissions.AUDIO_RECORDING);
        types.includes(PermissionTypes.video) && permissions.push(Permissions.CAMERA);
        Permissions.getAsync(...permissions)
          .then((res) => res.granted)
          .then((granted) => {
            return granted ? true : Permissions.askAsync(...permissions).then((s) => s.granted);
          })
          .then((granted) => {
            resolve(granted);
          })
          .catch(reject);
      }
    })
      .then((granted) => {
        console.log('permissions', 'granted ? ' + granted);
        granted && this.permissionsGranted(...types);
        this.askPermissionsPromise = undefined;
        return granted;
      })
      .catch((e) => {
        console.log(e);
        console.log('permissions', 'error');
        this.askPermissionsPromise = undefined;
        return false;
      });
    return this.askPermissionsPromise;
  }

  public static async isCameraBlocked() {
    console.log('permissions', 'camera');
    return this.getPermissions(PermissionTypes.video).then((granted) => !granted);
  }

  public static async isMicrophoneBlocked() {
    console.log('permissions', 'mic');
    return this.getPermissions(PermissionTypes.audio).then((granted) => !granted);
  }

  public static async isCameraOrMicrophoneBlocked() {
    return this.getPermissions(PermissionTypes.audio, PermissionTypes.video).then((granted) => !granted);
  }

  public static alertNoPermission(wasCalling = false) {
    const texts: string[] = [];
    !this.hasCameraPermission && texts.push('دوربین (Camera)');
    !this.hasMicPermission && texts.push('میکروفون (Microphone)');
    const text = texts.join(' و ');
    if (wasCalling) {
      return alert(`تماس صوتی یا تصویری برقرار شده با شما لغو شد ، چون اجازه ${text} بروزر شما برای این سایت در حالت Deny قرار دارد`);
    }
    alert(`لطفا جهت استفاده از اپلیکیشن و برقراری تماس ابتدا اجازه ${text} را در تنظیمات بروزر برای این سایت از حالت Deny به حالت Allow تغییر دهید`);
  }
}
