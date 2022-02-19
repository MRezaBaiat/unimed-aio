import Gateway, { ResponseType } from './Gateway';
import { Conference } from 'api';

export default class ChatApi {
  public static initiateCall(targetId: string, type: string, deviceInfo: any): ResponseType<Conference> {
    return Gateway.post(
      `/api/call/initiate?id=${targetId}&type=${type}`,
      {
        deviceInfo: {
          brand: deviceInfo.brand,
          designName: deviceInfo.designName,
          deviceName: deviceInfo.deviceName,
          deviceYearClass: deviceInfo.deviceYearClass,
          isDevice: deviceInfo.isDevice,
          deviceType: deviceInfo.deviceType,
          manufacturer: deviceInfo.manufacturer,
          modelId: deviceInfo.modelId,
          modelName: deviceInfo.modelName,
          osName: deviceInfo.osName,
          osVersion: deviceInfo.osVersion,
          platformApiLevel: deviceInfo.platformApiLevel,
          supportedCpuArchitectures: deviceInfo.supportedCpuArchitectures,
        },
      },
      {},
      { timeout: 6000 }
    );
  }

  public static endCall(sessionId: string): ResponseType<void> {
    return Gateway.post('/api/call/hangup?id=' + sessionId, {});
  }

  public static declineCall(session: Conference, reason?: string): ResponseType<void> {
    return Gateway.post('/api/call/decline?id=' + session.id, { reason });
  }

  public static acceptCall(session: Conference, deviceInfo: any): ResponseType<void> {
    console.log('accepting to ' + session.host + '/call/accept?id=' + session.id);
    return Gateway.post('/api/call/accept?id=' + session.id, {
      deviceInfo: {
        brand: deviceInfo.brand,
        designName: deviceInfo.designName,
        deviceName: deviceInfo.deviceName,
        deviceYearClass: deviceInfo.deviceYearClass,
        isDevice: deviceInfo.isDevice,
        deviceType: deviceInfo.deviceType,
        manufacturer: deviceInfo.manufacturer,
        modelId: deviceInfo.modelId,
        modelName: deviceInfo.modelName,
        osName: deviceInfo.osName,
        osVersion: deviceInfo.osVersion,
        platformApiLevel: deviceInfo.platformApiLevel,
        supportedCpuArchitectures: deviceInfo.supportedCpuArchitectures,
      },
    });
  }
}
