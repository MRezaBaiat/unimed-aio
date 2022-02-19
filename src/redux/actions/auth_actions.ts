export const ACTION_SET_AUTH = 'ACTION_SIGN_IN';
export const ACTION_SET_UPDATE_INFO = 'ACTION_SET_UPDATE_INFO';
export const ACTION_LOG_OUT = 'ACTION_LOG_OUT';

export const actionLogOut = () => {
  return {
    type: ACTION_LOG_OUT,
  };
};

export const actionSetAuthorization = (authorization: string | null) => {
  return {
    type: ACTION_SET_AUTH,
    payload: authorization,
  };
};

export const actionSetUpdateinfo = (updateInfo: any) => {
  return {
    type: ACTION_SET_UPDATE_INFO,
    payload: updateInfo,
  };
};
