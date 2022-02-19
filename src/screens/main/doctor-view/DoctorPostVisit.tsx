import React, { memo, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import R from '../../../assets/R';
import UserApi from '../../../network/UserApi';
import { actionSetFinalizableVisits } from '../../../redux/actions/users_actions';
import AppContainer from '../../../components/base/app-container/AppContainer';
import AppImageView from '../../../components/base/app-image/app-imageview';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppView from '../../../components/base/app-view/AppView';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import AppNavigator from '../../../navigation/AppNavigator';
import DoctorPostVisitModal from '../../../modals/DoctorPostVisitModal';
import dictionary from '../../../assets/strings/dictionary';
import { Visit } from 'api';

interface Props {
  visit: Visit;
}
const DoctorPostVisit = (props: Props) => {
  const visit = props.visit;
  const dispatch = useDispatch();

  const [confirmModalVisible, setConfirmModalVisible] = useState(true);
  return (
    <AppContainer style={{ alignItems: 'center', backgroundColor: '#38488A' }}>
      <AppImageView style={{ width: wp(42), height: wp(42), marginTop: hp(15) }} src={R.images.DoctorEnd} />
      <AppView
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#50BCBD',
          height: hp(8),
          width: wp(100),
          marginTop: hp(4),
        }}
      >
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_faNum_Bold,
            fontSize: R.fontsSize.large,
            color: '#FFFFFF',
          }}
          text="مشاوره شما به پایان رسید"
        />
      </AppView>
      <DoctorPostVisitModal
        modalVisible={confirmModalVisible}
        onConfirmClick={() => {
          UserApi.sendPostVisit_Doctor(visit._id, false)
            .then((res) => {
              dispatch(actionSetFinalizableVisits(res.data));
              setConfirmModalVisible(false);
              AppNavigator.resetStackTo('MainScreen');
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        onCancelClick={() => {
          UserApi.sendPostVisit_Doctor(visit._id, true)
            .then((res) => {
              dispatch(actionSetFinalizableVisits(res.data));
              AppNavigator.resetStackTo('MainScreen');
              setConfirmModalVisible(false);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        text={dictionary.should_receive_payment_from_patient}
        title={dictionary.end_visit}
      />
    </AppContainer>
  );
};

export default memo(DoctorPostVisit);
