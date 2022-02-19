import { useEffect, useState } from 'react';
import AudioPlayingService, { PlayerProgressState, PlayState } from './AudioPlayingService';

function useAudioPlayer(path: string) {
  const [state, setState] = useState({ progress: {}, state: 'idle' } as { currentPath: string | undefined; state: PlayState; progress: PlayerProgressState });

  useEffect(() => {
    const listener = (playerState) => {
      setState(playerState);
    };
    AudioPlayingService.getStateReport().then((s) => setState(s));
    AudioPlayingService.subscribe(path, listener);
    return () => {
      AudioPlayingService.unsubscribe(path, listener);
    };
  }, []);

  return state;
}

export default useAudioPlayer;
