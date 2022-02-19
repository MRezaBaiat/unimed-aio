import React, { useEffect, useState } from 'react';
import CodePush, { RemotePackage } from 'react-native-code-push';
import NetUtils from '../../helpers/NetUtils';
import Storage from '../../helpers/Storage';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppNavigator from '../../navigation/AppNavigator';
import RootStack, { PreloadFallback } from '../../navigation/Routes';
import { NavigationContainer } from '@react-navigation/native';
import AppView from '../../components/base/app-view/AppView';

const SyncStatus = CodePush.SyncStatus;
const InstallMode = CodePush.InstallMode;

function SyncScreen(props) {
  const [canContinue, setCanContinue] = useState(Storage.get('iframe-checked') === 'true'); // should always be true here since it is separate from the color picker version
  const [syncStatus, setSyncStatus] = useState(undefined as CodePush.SyncStatus | undefined);
  const [update, setUpdate] = useState(undefined as RemotePackage | undefined);
  const [downloadProgress, setDownloadProgress] = useState('0');
  const [text, setText] = useState(NetUtils.isConnected() ? 'چند لحظه...' : 'لطفا اینترنت خود را بررسی کنید و دوباره برنامه را اجرا کنید');
  console.group('syncing');
  console.log('[sync-status]', syncStatus);
  console.log('[update-status]', update);
  console.log('[download-progress]', downloadProgress);
  console.groupEnd();
  useEffect(() => {
    if (syncStatus) {
      switch (syncStatus) {
        case SyncStatus.CHECKING_FOR_UPDATE:
          return setText('چند لحظه...');
        case SyncStatus.DOWNLOADING_PACKAGE:
          return setText(` در حال به روز رسانی ${downloadProgress}%`);
        case SyncStatus.INSTALLING_UPDATE:
          return setText('در حال اعمال تغییرات...');
        case SyncStatus.UPDATE_INSTALLED:
          Storage.set('iframe-checked', 'true');
          setCanContinue(true);
          return setText('انجام شد');
        case SyncStatus.SYNC_IN_PROGRESS:
          return setText('در حال آماده شدن برای بررسی تغییرات');
        case SyncStatus.UNKNOWN_ERROR:
          return setText('خطایی در ارتباط با سرور رخ داد ، لطفا اینترنت خود را بررسی کنید و دوباره برنامه را اجرا کنید');
        case SyncStatus.UP_TO_DATE:
          setCanContinue(true);
          Storage.set('iframe-checked', 'true');
          break;
      }
    }
  }, [syncStatus, downloadProgress]);
  useEffect(() => {
    if (__DEV__) {
      return setCanContinue(true);
    }
    // deploymentKey: Platform.OS === 'android' ? 'FbijtL8FXkqowWThx0hvzZkY2vL1Jr_9WZk83' : 'XqqM_J0FweluCO6WDSRJQnn9xGTVlIkK_vUyP'
    // Alert.alert('Beta testing mode enabled');
    CodePush.sync(
      {
        mandatoryInstallMode: InstallMode.IMMEDIATE,
        installMode: InstallMode.IMMEDIATE,
      },
      (status) => {
        if ((syncStatus === SyncStatus.INSTALLING_UPDATE || syncStatus === SyncStatus.UPDATE_INSTALLED || syncStatus === SyncStatus.DOWNLOADING_PACKAGE || syncStatus === SyncStatus.SYNC_IN_PROGRESS || syncStatus === SyncStatus.CHECKING_FOR_UPDATE) && status === SyncStatus.UP_TO_DATE) {
          CodePush.allowRestart();
          CodePush.restartApp(false);
        }
        setSyncStatus(status);
      },
      (progress) => {
        setDownloadProgress(String(Math.round((progress.receivedBytes * 100) / progress.totalBytes)));
      },
      () => {
        console.log('binary mismatched , skipping update');
        setCanContinue(true);
      }
    ).catch((err) => {
      console.warn(err);
      setCanContinue(true);
    });
  }, []);
  return (
    /* (canContinue || syncStatus === SyncStatus.UP_TO_DATE)
      ? <NavigationContainer ref={AppNavigator.setTopLevelNavigator} fallback={<PreloadFallback/>}>
          <RootStack initial={'SplashScreen'}/>
        </NavigationContainer>
      : <AppView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
            <TextRenderer text={text}/>
        }
    </AppView> */
    <NavigationContainer ref={AppNavigator.setTopLevelNavigator} fallback={<PreloadFallback />}>
      <RootStack initial={'SplashScreen'} />
    </NavigationContainer>
  );
}

/* <NavigationContainer ref={AppNavigator.setTopLevelNavigator} fallback={<PreloadFallback/>}>
  <StatusBar hidden={false} animated={true}/>
  <RootStack initial={'SplashScreen'}/>
</NavigationContainer> */

function TextRenderer({ text }) {
  return <AppTextView text={text} style={{ marginLeft: '10%', marginRight: '10%', textAlign: 'center' }} />;
}

export default React.memo(SyncScreen);
