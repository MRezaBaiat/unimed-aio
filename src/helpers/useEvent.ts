import { useEffect, useState } from 'react';
import { Events } from 'api';

export default function useEvent(event: string | string[], cb?: (data: any) => void) {
  const [state, setState] = useState();

  useEffect(() => {
    const listener =
      cb ||
      function (data) {
        setState(data);
      };
    Events.on(event, listener);
    return () => {
      Events.off(listener);
    };
  }, []);

  return cb ? undefined : state;
}
