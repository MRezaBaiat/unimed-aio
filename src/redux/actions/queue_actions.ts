export const ACTION_SET_QUEUE = 'ACTION_SET_QUEUE';

export const setQueue = (queue: number, estimated: number) => {
  return {
    type: ACTION_SET_QUEUE,
    payload: {
      queue,
      estimated,
    },
  };
};
