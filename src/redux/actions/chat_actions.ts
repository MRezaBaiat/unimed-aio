import { Helper, ChatType, SendStatus, TypingStatus, Chat } from 'api';
import ChatService from '../../services/ChatService';
import Kit from 'javascript-dev-kit';
import FileAsset from '../../helpers/file-manager/FileAsset';

export const ACTION_NEW_MESSAGE = 'ACTION_NEW_MESSAGE';
export const ACTION_SET_CONVERSATIONS = 'ACTION_SET_CONVERSATIONS';
export const ACTION_SET_TYPING_STATUS = 'ACTION_SET_TYPING_STATUS';
export const ACTION_SET_TYPING_STATUS_EXPIRATION_TIMER_ID = 'ACTION_SET_TYPING_STATUS_EXPIRATION_TIMER_ID';

const addNewChatMessage = (chat: Chat) => {
  return (dispatch, getState) => {
    dispatch(actionSetTypingStatus(TypingStatus.IDLE));
    clearTimeout(getState().chatsReducer.typingStatusExpirationTimerId);
    dispatch({
      type: ACTION_NEW_MESSAGE,
      payload: chat,
    });
  };
};

export const actionSetTypingStatus = (status: TypingStatus) => {
  return (dispatch, getState) => {
    clearTimeout(getState().chatsReducer.typingStatusExpirationTimerId);
    if (status !== TypingStatus.IDLE) {
      dispatch(
        actionSetTypingStatusTimerId(
          setTimeout(() => {
            dispatch(actionSetTypingStatus(TypingStatus.IDLE));
          }, 3000)
        )
      );
    }
    dispatch({
      type: ACTION_SET_TYPING_STATUS,
      payload: status,
    });
  };
};

export const actionSetTypingStatusTimerId = (id) => {
  return {
    type: ACTION_SET_TYPING_STATUS_EXPIRATION_TIMER_ID,
    payload: id,
  };
};

export const setConversations = (conversations: Chat[]) => {
  return {
    type: ACTION_SET_CONVERSATIONS,
    payload: conversations,
  };
};

export const actionSendText = (text: string, targetId: string, replayToId?: string) => {
  return (dispatch, getState) => {
    const chat: Chat = {
      id: Kit.generateUUID(),
      sendStatus: SendStatus.WAITING_FOR_QUEUE,
      type: ChatType.TEXT,
      sender: getState().userReducer.user._id,
      text,
      date: new Date().getTime(),
    };
    dispatch(addNewChatMessage(chat));
    ChatService.sendMessage(chat, targetId);
  };
};

export const actionSendFile = (file: FileAsset, visitId: string) => {
  return (dispatch, getState) => {
    const send = async () => {
      const stats = await file.get();

      const chat: Chat = {
        id: Kit.generateUUID(),
        sendStatus: SendStatus.WAITING_FOR_QUEUE,
        type: file.type,
        sender: getState().userReducer.user._id,
        createdAt: smartDate().toISOString(),
        fileName: stats.name,
      };
      chat.localFile = file;
      chat.fileSize = stats.size;
      chat.mediaInfo = { ...file.mediaInfo };
      dispatch(addNewChatMessage(chat));
      file.upload(chat.id, visitId);
    };
    send();
  };
};

export const actionSendStatusChanged = (chatId: string, status: SendStatus) => {
  return (dispatch, getState) => {
    // const chats: Chat[] = Gson.copy(getState().chatsReducer.chats);
    const chats: Chat[] = getState().chatsReducer.chats;
    const chat = chats.find((s) => s.id === chatId);

    if (chat) {
      // chats.splice(chats.indexOf(chat), 1, { ...chat, sendStatus: status });
      dispatch(setConversations([...chats.replace(chat, { ...chat, sendStatus: status })]));
    }
  };
};

/* export const actionReceiveStatusChanged = (chatId: string, status:ReceiveStatus) => {
  return (dispatch, getState) => {
    const chats: Chat[] = Gson.copy(getState().chatsReducer.chats);
    const chat = chats.find(s => s.id === chatId);
    if (chat) {
      chats.splice(chats.indexOf(chat), 1, { ...chat, receiveStatus: status });
      dispatch(setConversations(chats));
    }
  };
}; */

/* export const actionReceiveStatusChangedForUrl = (url: string, status:ReceiveStatus) => {
  return (dispatch, getState) => {
    const chats: Chat[] = Gson.copy(getState().chatsReducer.chats);
    dispatch(setConversations(chats.map((chat) => {
      if (chat.url === url) {
        chat.receiveStatus = status;
      }
      return chat;
    })));
  };
}; */

export const actionSetConversation = (conversation: Chat[]) => {
  return (dispatch, getState) => {
    const chats = getState().chatsReducer.chats;
    const res = conversation.map((chat) => {
      const current = chats.find((s) => s.id === chat.id);
      return current || chat;
    });
    dispatch(setConversations(res));
  };
};

export const actionChatReceived = (chat: Chat) => {
  return (dispatch, getState) => {
    const chats = getState().chatsReducer.chats;
    if (chats.find((s) => s.id === chat.id)) {
      return;
    }
    dispatch(addNewChatMessage(chat));
  };
};

export const actionPlayAudio = () => {};

export const actionPauseAudio = () => {};

export const actionDeleteChat = (chatId: string) => {
  return (dispatch, getState) => {
    /*const chats: Chat[] = Gson.copy(getState().chatsReducer.chats);
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) {
      return;
    }
    if (chat.localFile) {
      UploadService.cancelUpload(chat.localFile.path);
    }
    if (chat.url) {
      DownloadService.cancelDownload(chat.url);
    }
    chats.splice(chats.indexOf(chat), 1);
    dispatch(setConversations(chats));*/
  };
};

export const actionPlayVideo = () => {};
