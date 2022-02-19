import { useState, useEffect } from 'react';
import { Chat } from 'api';
import FileAsset, { FileAssetState } from './FileAsset';

function useFileAsset(chat: Chat, temporary: boolean) {
  const [state, setState] = useState(undefined as FileAssetState | undefined);

  useEffect(() => {
    const listener = (fileState: FileAssetState) => {
      setState(fileState);
    };
    FileAsset.create(chat, { type: chat.type, temporary }).then((file) => {
      file && file.on('state-change', listener);
      file && file.get().then(listener);
    });
    return () => {
      state && state.source.off('state-change', listener);
    };
  }, []);

  return state;
}

export default useFileAsset;
