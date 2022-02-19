// import { Audio, AVPlaybackStatus } from 'expo-av';
// import { Sound } from 'expo-av/build/Audio/Sound';
import AudioPlayer from './AudioPlayer';
// import { Howl } from 'howler';

export type PlayState = 'idle' | 'playing' | 'paused';
export type PlayerProgressState = { current: number; total: number };
export interface AudioPlayerInterface {
  pause(): Promise<void>;
  release(): Promise<void>;
  play(path: string): Promise<void>;
  resume(): Promise<void>;
  seek(progress: number);
  getProgress(): Promise<PlayerProgressState>;
}
type ListenerType = (state: { currentPath: string | undefined; state: PlayState; progress: PlayerProgressState }) => void;
let currentPath;
const listeners: { [key: string]: ListenerType[] } = {};
let state: PlayState = 'idle';
let tid;
const player: AudioPlayerInterface = new AudioPlayer(async () => {
  await instance.release();
});
class AudioPlayingService {
  public subscribe = (path: string, cb: ListenerType) => {
    listeners[path] = listeners[path] || [];
    !listeners[path].includes(cb) && listeners[path].push(cb);
  };

  public unsubscribe = (path: string, cb: ListenerType) => {
    listeners[path] && listeners[path].includes(cb) && listeners[path].splice(listeners[path].indexOf(cb), 1);
  };

  private notifyListeners = async () => {
    if (!currentPath) {
      return;
    }
    const report = await this.getStateReport();
    listeners[currentPath] &&
      listeners[currentPath].forEach((cb) => {
        cb(report);
      });
  };

  public getStateReport = async () => {
    const progress = currentPath && (await player.getProgress());
    return {
      currentPath,
      state,
      progress: progress || {},
    };
  };

  public playOrPause = async (path: string) => {
    try {
      if (currentPath && currentPath !== path) {
        await this.release();
      }
      console.log('play');
      if (state === 'playing') {
        await player.pause();
        state = 'paused';
      } else if (state === 'paused') {
        await player.resume();
        state = 'playing';
      } else if (state === 'idle') {
        await player.play(path);
        state = 'playing';
      }
      currentPath = path;
      if (state === 'playing') {
        this.startTimer();
      } else {
        this.stopTimer();
      }
      this.notifyListeners();
    } catch (e) {
      console.log(e);
      await this.release();
    }
  };

  private startTimer = () => {
    if (tid) {
      return;
    }
    tid = setInterval(() => {
      this.notifyListeners();
    }, 100);
  };

  private stopTimer = () => {
    if (!tid) {
      return;
    }
    clearTimeout(tid);
    tid = undefined;
  };

  public release = async () => {
    this.stopTimer();
    state = 'idle';
    await this.notifyListeners();
    const oldPath = currentPath;
    currentPath = undefined;
    try {
      oldPath && (await player.release());
    } catch (e) {
      console.log(e);
    }
    await this.notifyListeners();
  };

  public seek = (path: string, progress: number) => {
    if (currentPath !== path) {
      return;
    }
    player.seek(progress);
  };
}

const instance = new AudioPlayingService();

export default instance;
/*

export const PLAYER_STATE = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED'
};

/!* interface Listener{
  [key:string] : (()=>void) []
}
const listeners: Listener = {}; *!/

let currentlyPlaying: {
  path: string,
  player: Howl,
  status: 'unloaded' | 'loading' | 'loaded',
  tid: any
} | undefined;

const addListener = (path: string, cb:()=>void) => {
  listeners[path] = listeners[path] || [];
  !listeners[path].includes(cb) && listeners[path].push(cb);
};

const removeListener = (path: string, cb:()=>void) => {
  listeners[path] && listeners[path].includes(cb) && listeners[path].splice(listeners[path].indexOf(cb), 1);
};

const notifyListeners = (forPath: string) => {
  listeners[forPath] && listeners[forPath].forEach((cb) => {
    cb();
  });
};

const getReport = async () => {
  const durStates = await getDurationStats();
  return {
    playingPath: currentlyPlaying && currentlyPlaying.path,
    state: getState(),
    current: durStates.current,
    total: durStates.total
  };
};

const getState = () => {
  if (!currentlyPlaying) {
    return PLAYER_STATE.IDLE;
  }
  if (currentlyPlaying.player.playing()) {
    return PLAYER_STATE.PLAYING;
  }
  return PLAYER_STATE.PAUSED;
};

const getDurationStats = async () => {
  if (!currentlyPlaying) {
    return { total: undefined, current: undefined };
  }

  return { total: currentlyPlaying.player.duration(), current: currentlyPlaying.player.seek() };
};

const seek = (position: number) => {
  if (currentlyPlaying) {
    currentlyPlaying.player.seek(position);
    /!* currentlyPlaying.player.setStatusAsync({
      positionMillis: position
    }); *!/
  }
};

const release = () => {
  if (currentlyPlaying && currentlyPlaying.player) {
    const path = currentlyPlaying.path;
    currentlyPlaying.player.unload();
    currentlyPlaying = undefined;
    notifyListeners(path);
  }
};

/!*
const resume = (path: string)=>{
  if(!currentlyPlaying || currentlyPlaying.path !== path || !currentlyPlaying.status.isLoaded || currentlyPlaying.status.isPlaying){
    return;
  }
  return play(path);
};
*!/

const startTimer = () => {
  if (!currentlyPlaying || currentlyPlaying.tid) {
    return;
  }
  currentlyPlaying.tid = setInterval(() => {
    notifyListeners(currentlyPlaying && currentlyPlaying.path);
  }, 300);
};

const stopTimer = () => {
  if (currentlyPlaying && currentlyPlaying.tid) {
    clearInterval(currentlyPlaying.tid);
    currentlyPlaying.tid = undefined;
  }
};

const play = async (path: string) => {
  if (currentlyPlaying) {
    if (currentlyPlaying.path === path) {
      if (currentlyPlaying.player.playing()) {
        return;
      }
      return currentlyPlaying.player.play();
    }
    release();
  }

  console.log('playing ' + path);
  const sound = new Howl({
    src: path,
    format: ['mpeg']
  }).on('play', () => {
    notifyListeners(path);
    startTimer();
  }).on('end', () => {
    currentlyPlaying = undefined;
    stopTimer();
    notifyListeners(path);
  }).on('pause', () => {
    stopTimer();
    notifyListeners(path);
  });
  /!* const { sound, status } = await Sound.createAsync({ uri: path }, { shouldPlay: true, positionMillis: 0 }, (update: AVPlaybackStatus) => {
    if (currentlyPlaying && currentlyPlaying.player === sound) {
      currentlyPlaying.status = update;
      console.log('mstatus', update);
      notifyListeners(path);
    }
  }); *!/
  currentlyPlaying = {
    path,
    status: '',
    player: sound
  };
  sound.play();
  // sound.playAsync();
  notifyListeners(path);
};

const isCurrentlyPlaying = (path: string) => {
  return currentlyPlaying && path === currentlyPlaying.path;
};

const pause = () => {
  if (currentlyPlaying) {
    currentlyPlaying.player.pause();
  }
};

export default {
  addListener,
  removeListener,
  stop,
  play,
  pause,
  seek,
  getState,
  isCurrentlyPlaying,
  getReport
};
*/
