export interface EventsMap {
  [event: string]: any;
}
export interface DefaultEvents extends EventsMap {
  [event: string]: (...args: any) => void;
}
interface Unsubscribe {
  unbind(): void;
}
export default class EventEmitter<Events extends EventsMap = DefaultEvents> {
  // @ts-ignore
  private listeners: { [E in keyof Events]: ((args: Events[E]) => void)[] } = {};

  public on<K extends keyof Events>(event: K, cb: Events[K]): Unsubscribe {
    this.listeners[event] = this.listeners[event] || [];
    !this.listeners[event].includes(cb) && this.listeners[event].push(cb);
    return {
      unbind: () => {
        this.off(event, cb);
      },
    };
  }

  public off<K extends keyof Events>(event: K, cb: Events[K]) {
    this.listeners[event].includes(cb) && this.listeners[event].splice(this.listeners[event].indexOf(cb));
  }

  public emitEvent<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
    this.listeners[event] &&
      this.listeners[event].forEach((cb) => {
        try {
          // @ts-ignore
          cb(...args);
        } catch (e) {
          console.warn(e);
        }
      });
  }
}
