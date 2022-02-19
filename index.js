import 'react-native-gesture-handler';
import 'webrtc-adapter';
import React from 'react';
import axios from 'axios';
import App from './App';
import ReactDOM from 'react-dom';
import { Gateway as JSGateway, smartDate, SmartDate } from 'javascript-dev-kit';
import { AppRegistry, Platform } from 'react-native';
import Gateway from './src/network/Gateway';
// '2021-07-10T06:58:34.829Z'
// '2021-07-10T06:58:34.829Z'

/* const originalError = console.error.bind(console.error);
console.error = function (...args) {
  const s = arguments && arguments[1];
  if (s && s.includes('enterkeyhint')) {
    return;
  }
  originalError(...args);
}; */

export const devHost = 'https://www.azandaz.az';
export const prdHost = 'https://www.azandaz.az';

// export const baseUrl = prdHost;
// export const chatServiceUrl = baseUrl;

axios.defaults.baseURL = prdHost;// baseUrl + ':8080/'
axios.defaults.withCredentials = true;

Gateway.setAxiosInstance(axios);
JSGateway.setAxiosInstance(axios);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
if (Platform.OS === 'web') {
    ReactDOM.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>, document.getElementById('root'));
} else {
    AppRegistry.registerComponent('main', () => App);
}
