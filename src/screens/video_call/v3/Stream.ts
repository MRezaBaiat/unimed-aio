import EventEmitter, { DefaultEvents, EventsMap } from './EventEmitter';

export default abstract class Stream<Events extends EventsMap = DefaultEvents> extends EventEmitter<Events> {
  public isDestroyed = false;
  public isStarted = false;

  public close() {
    this.isDestroyed = true;
  }
}
