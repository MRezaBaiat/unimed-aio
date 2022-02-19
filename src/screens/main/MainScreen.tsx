import React, { useEffect } from 'react';
import ChatService from '../../services/ChatService';
import { useSelector } from 'react-redux';
import { User, UserType, Visit } from 'api';
import DoctorView from './doctor-view/DoctorView';
import PatientView from './patient-view/PatientView';
import AppPermissions from '../../helpers/AppPermissions';
import PushNotificationService from '../../services/PushNotificationService';
import AppContainer from '../../components/base/app-container/AppContainer';
import { ActivityIndicator } from 'react-native';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import DoctorPostVisit from './doctor-view/DoctorPostVisit';
import PatientPostVisit from './patient-view/PatientPostVisit';
import AppView from '../../components/base/app-view/AppView';
import AppActivityIndicator from '../../components/base/app-activity-indicator/AppActivityIndicator';
import useUser from '../../hooks/useUser';
import useStatus from '../../hooks/useStatus';
import { StoreType } from '../../redux/Store';

function MainScreen(props) {
  const initialCode = getScreenParam(props, 'code');
  const user = useUser();
  const status = useStatus();
  const finalizationVisits = useSelector<StoreType, Visit[]>((state) => state.userReducer.finalizableVisits);
  useEffect(() => {
    PushNotificationService.requestUserPermission();
    if (user.type === UserType.DOCTOR) {
      AppPermissions.checkPermissions();
    }
  }, []);

  if (!status) {
    return (
      <AppContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
        {/* <AppTextView text={'در حال ارتباط با سرور...'}/> */}
        <AppView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <AppActivityIndicator color="#50BCBD" size="large" />
        </AppView>
      </AppContainer>
    );
  }

  if (!user) {
    AppNavigator.resetStackTo('SigninScreen');
    return <></>;
  }

  if (finalizationVisits && finalizationVisits.length !== 0) {
    return user.type === 'DOCTOR' ? <DoctorPostVisit visit={finalizationVisits[0]} /> : <PatientPostVisit visit={finalizationVisits[0]} />;
  }

  return user.type === 'DOCTOR' ? <DoctorView /> : <PatientView initialCode={initialCode} />;
}

export default React.memo(MainScreen);
