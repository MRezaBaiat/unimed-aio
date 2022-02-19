import React, { useEffect, useState } from 'react';
import { Modal, Keyboard, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { User } from 'api';
import config from '../config/config';
import AppView from '../components/base/app-view/AppView';
import { hp, wp } from '../helpers/responsive-screen';
import AppTextView from '../components/base/app-text-view/AppTextView';
import R from '../assets/R';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import dictionary, { DictRecord } from '../assets/strings/dictionary';
import AppModal from '../components/base/app-modal/AppModal';
import useUser from '../hooks/useUser';

interface Props {
  onRequestClose?: () => void;
  modalVisible: boolean;
  closeModal: () => void;
  title: string | DictRecord;
}
function SoundSettingModal(props: Props) {
  const { onRequestClose, modalVisible, closeModal, title } = props;
  const [defAlarm, setDefAlarm] = useState(config.getNewPatientVoiceMode() === 'voice');

  useEffect(() => {
    config.setNewPatientVoiceMode(defAlarm ? 'voice' : 'notification');
  }, [defAlarm]);

  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={true} visible={modalVisible}>
      <AppView
        style={[
          {
            height: hp(50),
            backgroundColor: '#FFFFFF',
            marginTop: hp(50),
            borderTopLeftRadius: hp(3),
            borderTopRightRadius: hp(3),
            alignItems: 'center',
          },
        ]}
      >
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_Bold,
            marginTop: hp(5),
            marginRight: wp(12),
            alignSelf: 'flex-end',
          }}
          textColor="#50BCBD"
          fontSize={wp(3.8)}
          text={title}
        />
        <AppTouchable
          onClick={() => {
            setDefAlarm(false);
          }}
          style={{
            width: wp(76),
            height: hp(8),
            borderColor: '#F2F2F2',
            borderBottomWidth: 2,
            marginTop: hp(2),
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <AppView style={{ height: 25, width: 25, borderRadius: 15, borderWidth: 1, borderColor: '#939393', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>{!defAlarm && <AppView style={{ height: 15, width: 15, borderRadius: 7.5, backgroundColor: '#3ac248' }} />}</AppView>
          <AppTextView style={{ fontFamily: R.fonts.fontFamily, fontSize: wp(3.3) }} textColor="#4e55a1" text={dictionary.play_new_patient_notifications} />
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_Bold, fontSize: wp(3) }} textColor="#4e55a1" text={dictionary.default_sound} />
        </AppTouchable>
        <AppTouchable
          onClick={() => {
            setDefAlarm(true);
          }}
          style={{
            width: wp(76),
            height: hp(5),
            borderColor: '#F2F2F2',
            marginTop: hp(2),
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <AppView style={{ height: 25, width: 25, borderRadius: 15, borderWidth: 1, borderColor: '#939393', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>{defAlarm && <AppView style={{ height: 15, width: 15, borderRadius: 7.5, backgroundColor: '#3ac248' }} />}</AppView>
          <AppTextView style={{ fontFamily: R.fonts.fontFamily, fontSize: wp(3.3) }} textColor="#4e55a1" text={dictionary.play_new_patient_notifications} />
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_Bold, fontSize: wp(3) }} textColor="#4e55a1" text={dictionary.unimed_special} />
        </AppTouchable>
        <AppTouchable
          onClick={closeModal}
          style={{
            height: hp(6.5),
            width: wp(76),
            marginTop: hp(3),
            borderRadius: hp(1.2),
            bottom: hp(8),
            position: 'absolute',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#50BCBD',
            borderWidth: 1,
          }}
        >
          <AppTextView text={dictionary.cancel} fontSize={wp(3.8)} style={{ color: '#50BCBD', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
      </AppView>
    </AppModal>
  );
}

export default React.memo(SoundSettingModal);
