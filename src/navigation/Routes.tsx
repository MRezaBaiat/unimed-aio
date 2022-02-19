import React, { Suspense, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppView from '../components/base/app-view/AppView';
import AppTextView from '../components/base/app-text-view/AppTextView';
import { maxAppHeight, maxAppWidth } from '../config/config';
import { screenWidth } from '../helpers/responsive-screen';
import AuthService from '../services/AuthService';
import { useSelector } from 'react-redux';
import { Platform, useWindowDimensions } from 'react-native';
import { childrenWithProps } from '../helpers';

const Stack = createStackNavigator();

// also can handle deep linking https://reactnavigation.org/docs/use-linking

const TAG = '[lazy-loader]';
const factories: any[] = [];
// const importants: any[] = [];

export const PreloadFallback = () => {
  return (
    <AppView style={{ display: 'flex', flex: 1, width: screenWidth, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <AppTextView text={'Loading... :)'} />
    </AppView>
  );
};

const preloadedCache = {};
const initLazy = (factory, exclude?) => {
  // important && importants.push(factory);
  !exclude && factories.push(factory);
  if (Platform.OS !== 'web') {
    factory().then((c) => (preloadedCache[factory] = c.default));
  }
  const Component = React.lazy(factory);
  const res = (props) => {
    const dimensions = useWindowDimensions();

    if (Platform.OS !== 'web') {
      const [Comp, setComp] = useState(preloadedCache[factory]);
      useEffect(() => {
        if (!Comp) {
          factory().then((c) => setComp(c.default));
        }
      }, []);

      return Comp ? childrenWithProps(dimensions, <Comp {...props} />) : <PreloadFallback />;
    }

    return <Suspense fallback={<PreloadFallback />}>{childrenWithProps(dimensions, <Component {...props} />)}</Suspense>;
  };
  res.factory = factory;
  return res;
};

export const preloadAll = async () => {
  if (Platform.OS !== 'web') {
    return;
  }
  // console.log(TAG, 'preloading ' + factories.length);
  if (await AuthService.isAuthenticated()) {
    await MainScreen.factory();
  } else {
    await SigninScreen.factory();
    IntroScreen.factory();
    MainScreen.factory();
  }
  for (const factory of factories) {
    factory();
  }
};

const CallScreen = initLazy(() => import('../screens/video_call/CallScreen'));
const VisitsHistoryScreen = initLazy(() => import('../screens/visits_history/VisitsHistoryScreen'));
const SettingsScreen = initLazy(() => import('../screens/settings/SettingsScreen'));
const DoctorWorkTimeSettingScreen = initLazy(() => import('../screens/doctor_setting/DoctorWorkTimeSettingScreen'));
const ChatScreen = initLazy(() => import('../screens/chat/ChatScreen'));
const VisitCheckScreen = initLazy(() => import('../screens/visit_check/VisitCheckScreen'));
const ChatHistoryDetails = initLazy(() => import('../screens/chat_history_details/ChatHistoryDetails'));
const TransactionsHistoryScreen = initLazy(() => import('../screens/transactions_history/TransactionsHistoryScreen'));
const HealthCentersScreen = initLazy(() => import('../screens/health_centers/HealthCentersScreen'));
const HealthCenterMembersScreen = initLazy(() => import('../screens/health_center_members/HealthCenterMembersScreen'));
const DoctorListScreen = initLazy(() => import('../screens/doctor_list/DoctorListScreen'));
const DoctorProfileScreen = initLazy(() => import('../screens/doctor_profile/DoctorProfileScreen'));
const PatientPostVisit = initLazy(() => import('../screens/main/patient-view/PatientPostVisit'));
const DoctorPostVisit = initLazy(() => import('../screens/main/doctor-view/DoctorPostVisit'));
const QueueListScreen = initLazy(() => import('../screens/queue_list/QueueListScreen'), true);
const Exit = initLazy(() => import('../screens/exit/Exit'));
const MainScreen = initLazy(() => import('../screens/main/MainScreen'), true);
const IntroScreen = initLazy(() => import('../screens/intro/IntroScreen'), true);
const SigninScreen = initLazy(() => import('../screens/signin/SigninScreen'), true);
const SplashScreen = initLazy(() => import('../screens/splash/SplashScreen'), true);

// const JitsiTest = initLazy(() => import('../screens/JitsiTest'), true);

/* function lazyWithPreload(factory) {
    const Component = initLazy(factory);
    Component.preload = factory;
    return Component;
} */
export const SuspenseLoad = (props: { import: () => Promise<any> }) => {
  const Comp = React.lazy(props.import);
  return (
    <Suspense fallback={<PreloadFallback />}>
      <Comp {...props} />
    </Suspense>
  );
};
const PaymentDoneScreen = (props) => <SuspenseLoad {...props} import={() => import('../screens/payment_done/PaymentDoneScreen')} />;

const cardStyle =
  Platform.OS === 'web'
    ? {
        maxWidth: maxAppWidth,
        maxHeight: maxAppHeight,
        alignSelf: screenWidth === maxAppWidth ? 'center' : undefined,
      }
    : undefined;

export default ({ initial }) => {
  const authorization = useSelector((s) => s.authReducer.authorization);
  useWindowDimensions();
  return (
    <Stack.Navigator
      headerMode={'none'}
      mode={'modal'}
      initialRouteName={initial}
      screenOptions={{
        animationTypeForReplace: 'push',
        headerShown: false,
        cardStyle,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
      <Stack.Screen name="payment-done" component={PaymentDoneScreen} />
      {authorization && (
        <>
          <Stack.Screen name="IntroScreen" component={IntroScreen} />
          <Stack.Screen name="VisitsHistoryScreen" component={VisitsHistoryScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="DoctorWorkTimeSettingScreen" component={DoctorWorkTimeSettingScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="CallScreen" component={CallScreen} />
          <Stack.Screen name="VisitCheckScreen" component={VisitCheckScreen} />
          <Stack.Screen name="ChatHistoryDetails" component={ChatHistoryDetails} />
          <Stack.Screen name="TransactionsHistoryScreen" component={TransactionsHistoryScreen} />
          <Stack.Screen name="HealthCentersScreen" component={HealthCentersScreen} />
          <Stack.Screen name="HealthCenterMembersScreen" component={HealthCenterMembersScreen} />
          <Stack.Screen name="DoctorListScreen" component={DoctorListScreen} />
          <Stack.Screen name="DoctorProfileScreen" component={DoctorProfileScreen} />
          <Stack.Screen name="PatientPostVisit" component={PatientPostVisit} />
          <Stack.Screen name="DoctorPostVisit" component={DoctorPostVisit} />
          <Stack.Screen name="QueueListScreen" component={QueueListScreen} />
          <Stack.Screen name="Exit" component={Exit} />
          <Stack.Screen name="MainScreen" component={MainScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
