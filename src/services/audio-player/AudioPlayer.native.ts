import { AudioPlayerInterface, PlayerProgressState } from './AudioPlayingService';
import { Audio, AVPlaybackStatus } from 'expo-av';

export default class AudioPlayer implements AudioPlayerInterface {
  private readonly onEnd: () => Promise<void>;
  private player!: Audio.Sound;
  private state?: AVPlaybackStatus;

  constructor(onEnd: () => Promise<void>) {
    this.onEnd = onEnd;
  }

  getProgress = async (): Promise<PlayerProgressState> => {
    if (!this.state || !this.state.isLoaded) {
      return {
        current: 0,
        total: 0,
      };
    }
    return {
      current: this.state.positionMillis / 1000,
      total: this.state.durationMillis! / 1000,
    };
  };

  pause(): Promise<any> {
    return this.player.pauseAsync();
  }

  play = async (path: string): Promise<void> => {
    this.state = undefined;
    this.player = (await Audio.Sound.createAsync({ uri: path })).sound;
    this.player.setOnPlaybackStatusUpdate((status) => {
      this.state = status;
      if (status.isLoaded && status.positionMillis === status.durationMillis) {
        this.onEnd();
      }
    });
    await this.player.playAsync();
  };

  async release(): Promise<any> {
    this.state = undefined;
    return this.player.unloadAsync();
  }

  async resume(): Promise<any> {
    return this.player.playAsync();
  }

  seek = async (progress: number) => {
    await this.player.setStatusAsync({ positionMillis: Math.trunc(progress * 1000) });
  };
}
