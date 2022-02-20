import React, { memo, useEffect } from 'react';
import { View, Text } from 'react-native';
import { DoctorStatus } from 'api';
import { useSelector } from 'react-redux';
import R from '../../assets/R';
import ChatService from '../../services/ChatService';
import store from '../../redux/Store';
import AppNavigator from '../../navigation/AppNavigator';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppHeader from '../../components/composite/header/AppHeader';
import { hp, wp } from '../../helpers/responsive-screen';
import AppView from '../../components/base/app-view/AppView';
import AppListView from '../../components/base/app-list-view/AppListView';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppPermissions from '../../helpers/AppPermissions';
import dictionary from '../../assets/strings/dictionary';
import { smartDate } from 'javascript-dev-kit';
import useStatus from '../../hooks/useStatus';

const getLastPatientInQueueTime = (initiateDate: string) => {
  const SecondsToNow = (smartDate().getTime() - smartDate(initiateDate).getTime()) / 1000;
  return SecondsToNow < 60 ? `${Math.round(SecondsToNow)} ${dictionary['ثانیه']} ` : `${Math.round(SecondsToNow / 60)} ${dictionary['دقیقه']} `;
};

function QueueListScreen(props) {
  const status = useStatus() as DoctorStatus;
  const queueList = status.queueList;
  console.log(status.visit);

  const _acceptVisit = (item) => {
    AppPermissions.checkPermissions().then((granted) => {
      if (granted) {
        ChatService.acceptVisit(item._id);
      }
    });
  };

  return (
    <AppContainer style={{ backgroundColor: '#50BCBD', flex: 1 }}>
      <AppHeader text={dictionary.patience_in_queue} />
      <AppView
        style={{
          height: hp(89),
          width: wp(100),
          marginTop: hp(11),
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: hp(3),
          borderTopRightRadius: hp(3),
          paddingVertical: wp(4),
        }}
      >
        <AppListView
          data={queueList}
          renderItem={({ item }) => (
            <AppTouchable
              onClick={() => {
                _acceptVisit(item);
              }}
              style={{ width: wp(92), height: hp(12.5), borderRadius: hp(1.2), alignSelf: 'center', borderWidth: 0.75, borderColor: '#BDBDBD', marginTop: hp(1.2), flexDirection: 'row-reverse', alignItems: 'center', paddingStart: '4%' }}
            >
              <AppImageView src={item.patient.imageUrl} resizeMode="cover" style={{ height: hp(9.3), width: hp(9.3), borderRadius: 100 }} />
              <AppView style={{ height: '60%', width: '70%', marginRight: '4%', justifyContent: 'space-between' }}>
                <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.8), color: '#38488a' }} text={item.patient.name && item.patient.name !== 'Unknown' ? item.patient.name : item.patient.mobile.slice(0, 4) + '***' + item.patient.mobile.slice(7, 14)} />
                <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.3), color: '#9E9E9E' }} text={`${dictionary.last_patient_waiting_time}: ${getLastPatientInQueueTime(item.createdAt)}`} />
              </AppView>
              <AppImageView style={{ height: hp(2), width: hp(1.5), position: 'absolute', right: '6%' }} src={R.images.icons.arrow_left} />
            </AppTouchable>
          )}
        />
      </AppView>
    </AppContainer>
  );
}

export default memo(QueueListScreen);
