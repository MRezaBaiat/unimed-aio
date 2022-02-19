import Gateway, { fileFormData, ResponseType } from './Gateway';

export default class ChatApi {
  /* static postVoice = (chatId: string, roomId:string, filePath: string): ResponseType<string> => {
      return Gateway.post('/api/chatfiles', fileFormData('file://' + filePath, 'audio/aac'), {
        type: ChatType.MUSIC,
        id: chatId,
        roomId
      });
    }; */
}
