import React, { memo, useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import R from '../../assets/R';
import { Helper, User } from 'api';
import VisitApi from '../../network/VisitApi';
import { StyleSheet, Linking } from 'react-native';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppHeader from '../../components/composite/header/AppHeader';
import AppImageView from '../../components/base/app-image/app-imageview';
import { hp, wp } from '../../helpers/responsive-screen';
import GlobalAlert from '../../modals/global_alert/GlobalAlert';
import AppView from '../../components/base/app-view/AppView';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppListView from '../../components/base/app-list-view/AppListView';
import { numberWithCommas } from '../../helpers';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import PaymentModal from '../../modals/PaymentModal';
import Kit from 'javascript-dev-kit';
import useUser from '../../hooks/useUser';
import useLang from '../../hooks/useLang';
import dictionary from '../../assets/strings/dictionary';

function DoctorProfileScreen(props) {
  const closeModal = () => {
    setModalVisible(false);
  };
  // const [workTime, setWorkTime] = useState([]);
  const doctorData = getScreenParam(props, 'DoctorData');
  console.log('dddd', doctorData);
  const videoCallAllowed = doctorData.details.videoCallAllowed;
  const type = getScreenParam(props, 'type');
  const workTime = doctorData.details.responseDays;
  const code = doctorData.code;
  const cost = doctorData.price;

  const lang = useLang();
  const [imageUrl, setImageUrl] = useState(doctorData.imageUrl);
  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [specialization, setSpecialization] = useState('');
  const [isResponse, setIsResponse] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDoctorAlert, setShowDoctorAlert] = useState(false);
  const [visitType, setvisitType] = useState(type || 'OnLine');
  const user = useUser();
  const isPatient = user.type === 'PATIENT';

  useEffect(() => {
    setIsResponse(doctorData.ready);
    setSpecialization(doctorData.specialization.name);
  }, []);

  const _sortDay = (day) => {
    switch (day) {
      case '0':
        return '6';
      case '6':
        return '5';
      case '5':
        return '4';
      case '4':
        return '3';
      case '3':
        return '2';
      case '2':
        return '1';
      case '1':
        return '0';
      default:
        return '';
    }
  };

  return (
    <AppContainer style={{ backgroundColor: '#50BCBD', flex: 1 }}>
      <AppHeader />
      {!videoCallAllowed && (
        <AppImageView
          resizeMode="contain"
          style={{
            height: hp(4.5),
            width: hp(4.5),
            top: hp(3.5),
            right: wp(7),
          }}
          src={R.images.icons.video_call_disabled}
        />
      )}

      {/* {showAlert && (
        <GlobalAlert
          text={`${doctorData.name} در حال حاضر پاسخگو نمی‌باشد`}
          BgColor="red"
          onEnd={() => { setShowAlert(false); }}
        />
      )} */}
      {showDoctorAlert && (
        <GlobalAlert
          text={'این امکان فقط برای نسخه بیمار قابل استفاده می‌باشد'}
          BgColor="red"
          onEnd={() => {
            setShowDoctorAlert(false);
          }}
        />
      )}
      {/* {!isResponse && (
        <GlobalAlert
          text={`${doctorData.name} در حال حاضر پاسخگو نمی‌باشد`}
          BgColor="red"
          onEnd={() => { setIsResponse(false); }}
        />
      )} */}
      {modalVisible && (
        <AppView
          style={{
            height: hp(100),
            width: wp(100),
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            position: 'absolute',
          }}
        />
      )}

      <AppView style={styles.container}>
        {/* avatar */}
        <AppImageView style={styles.avatar} src={imageUrl} />
        {/* avatar */}

        <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, marginTop: hp(2) }} textColor="#38488A" fontSize={wp(4.6)} text={doctorData.name} />
        <AppTextView
          style={{
            marginTop: hp(1),
            width: wp(76),
            paddingHorizontal: '4%',
            textAlign: 'center',
          }}
          textColor="#4f4f4f"
          fontSize={wp(3.3)}
          text={specialization}
        />
        {visitType === 'OnLine' && (
          <AppView
            style={{
              marginTop: hp(4),
              width: wp(100),
              backgroundColor: '#F2F2F2',
              height: hp(7),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} textColor="#38488A" fontSize={wp(4.6)} text={`${dictionary['کد اختصاصی'][lang]} ${code}`} />
          </AppView>
        )}

        {/* selectvisitType */}
        <AppView style={styles.selectvistType}>
          <AppTouchable
            onClick={() => {
              isPatient ? setvisitType('OnLine') : setShowDoctorAlert(true);
            }}
            style={{ flex: 1, height: '100%', borderRadius: hp(1.2), backgroundColor: visitType === 'OnLine' ? '#50BCBD' : '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}
          >
            <AppTextView fontSize={wp(3.8)} textColor={visitType === 'OnLine' ? '#FFFFFF' : '#50BCBD'} text={dictionary['مشاوره آنلاین']} />
          </AppTouchable>
          {/* <AppTouchable onClick={() => { isPatient ? setvisitType('Attendance') : setShowDoctorAlert(true); }} style={{ flex: 1, height: '100%', borderRadius: hp(1.2), backgroundColor: visitType === 'Attendance' ? '#50BCBD' : '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
            <AppTextView fontSize={wp(3.8)} textColor={visitType === 'Attendance' ? '#FFFFFF' : '#50BCBD'} text="نوبت حضوری" />
          </AppTouchable> */}
        </AppView>
        {/* selectvistType */}

        {visitType === 'OnLine' ? (
          <Fragment>
            <AppView
              style={{
                maxHeight: !isOpen ? hp(6.5) : hp(26),
                width: wp(76),
                borderWidth: 1,
                borderColor: '#38488A',
                marginTop: hp(2.2),
                borderRadius: hp(1.2),
              }}
            >
              <AppTouchable
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                style={{
                  width: '100%',
                  height: hp(6.5),
                  flexDirection: 'row-reverse',
                  paddingHorizontal: '6%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <AppTextView textColor="#38488A" fontSize={wp(3.8)} text={dictionary['ساعات پاسخگوئی آنلاین']} />
                <AppImageView resizeMode="contain" style={{ width: wp(4), height: wp(4) }} src={R.images.icons.arrow_down} />
              </AppTouchable>
              {isOpen && (
                <AppListView
                  style={{
                    backgroundColor: '#F2F2F2',
                    paddingHorizontal: '4%',
                    borderBottomLeftRadius: hp(1.2),
                    borderBottomRightRadius: hp(1.2),
                  }}
                  data={Object.keys(workTime)}
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  renderItem={({ item }) => {
                    const day = item;
                    const sortDay = _sortDay(day);
                    const values = workTime[sortDay];
                    return (
                      <AppView>
                        {values.map((WT, index) => {
                          return (
                            <AppView
                              style={{
                                height: hp(6.5),
                                width: '100%',
                                flexDirection: 'row-reverse',
                                borderColor: '#BDBDBD',
                                borderBottomWidth: 0.5,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: '2%',
                              }}
                            >
                              <AppTextView
                                style={{
                                  fontFamily: R.fonts.fontFamily_faNum,
                                  fontSize: wp(3.3),
                                }}
                                textAlign="right"
                                textColor="#4f4f4f"
                                text={Helper.dayNumberToString(sortDay, 'az')}
                              />
                              <AppTextView
                                style={{
                                  fontFamily: R.fonts.fontFamily_faNum,
                                  fontSize: wp(3.3),
                                }}
                                textAlign="right"
                                textColor="#4f4f4f"
                                text={`  ${WT.from.hour}:${WT.from.minute}  -  ${WT.to.hour}:${WT.to.minute}`}
                              />
                            </AppView>
                          );
                        })}
                      </AppView>
                    );
                  }}
                />
              )}
            </AppView>
            {isPatient && (
              <AppView
                style={{
                  height: hp(6.5),
                  width: wp(76),
                  marginTop: hp(2.2),
                  borderRadius: hp(1.2),
                  backgroundColor: '#F2F2F2',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row-reverse',
                  paddingHorizontal: '4%',
                }}
              >
                <AppTextView style={{ fontSize: wp(3.8) }} textAlign="right" textColor="#38488A" text={dictionary['مبلغ ویزیت:']} />
                <AppTextView
                  style={{
                    fontSize: wp(3.8),
                    fontFamily: R.fonts.fontFamily_faNum,
                  }}
                  textAlign="right"
                  textColor="#38488A"
                  text={`${numberWithCommas(cost)} ${dictionary.toman[lang]} `}
                />
              </AppView>
            )}
            {isPatient && (
              <AppTouchable
                onClick={() => {
                  isResponse ? setModalVisible(true) : setShowAlert(true);
                }}
                disabled={!isResponse}
                style={{
                  height: hp(6.5),
                  width: wp(76),
                  marginTop: hp(2.2),
                  borderRadius: hp(1.2),
                  backgroundColor: isResponse ? '#38488A' : 'grey',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppTextView
                  text={isResponse ? dictionary['مشاوره'] : dictionary['لطفا در ساعات پاسخگویی مراجعه فرمایید']}
                  fontSize={wp(3.8)}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: R.fonts.fontFamily_Bold,
                    textAlign: 'center',
                  }}
                />
              </AppTouchable>
            )}
          </Fragment>
        ) : (
          <AppView style={{ alignItems: 'center' }}>
            <AppView
              style={{
                height: hp(12),
                width: wp(100),
                marginTop: hp(5),
                backgroundColor: '#F2F2F2',
                flexDirection: 'row-reverse',
                paddingTop: hp(2.2),
              }}
            >
              <AppImageView resizeMode="contain" style={{ width: wp(5), height: wp(5), marginRight: wp(12) }} src={R.images.icons.locationblue} />
              <AppTextView
                style={{
                  fontFamily: R.fonts.fontFamily_faNum,
                  color: '#38488A',
                  textAlign: 'right',
                  marginRight: wp(5),
                  width: wp(65),
                  lineHeight: hp(3.5),
                }}
                text={`آدرس: ${doctorData.details.reservationInfo.address}`}
              />
            </AppView>
            <AppView
              style={{
                height: hp(12),
                width: wp(100),
                marginTop: hp(1),
                backgroundColor: '#F2F2F2',
                flexDirection: 'row-reverse',
                paddingTop: hp(2.2),
              }}
            >
              <AppImageView resizeMode="contain" style={{ width: wp(5), height: wp(5), marginRight: wp(12) }} src={R.images.icons.locationblue} />
              {doctorData.details.reservationInfo.cost && (
                <AppTextView
                  style={{
                    fontFamily: R.fonts.fontFamily_faNum,
                    color: '#38488A',
                    textAlign: 'right',
                    marginRight: wp(5),
                    width: wp(65),
                    lineHeight: hp(3.5),
                  }}
                  text={`هزینه : ${doctorData.details.reservationInfo.cost} تومان`}
                />
              )}
            </AppView>

            <AppTouchable
              onClick={() => {
                AppNavigator.navigateTo('AttendanceScreen', {
                  _id: doctorData._id,
                  address: doctorData.details.reservationInfo.address,
                  landPhone: doctorData.details.reservationInfo.phone,
                  coordinates: doctorData.details.reservationInfo.coordinates,
                });
              }}
              style={{
                height: hp(6.5),
                width: wp(76),
                marginTop: hp(5),
                borderRadius: hp(1.2),
                backgroundColor: '#38488A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppTextView
                text={'دریافت نوبت'}
                fontSize={wp(3.8)}
                style={{
                  color: '#FFFFFF',
                  fontFamily: R.fonts.fontFamily_Bold,
                  textAlign: 'center',
                }}
              />
            </AppTouchable>
          </AppView>
        )}
      </AppView>
      <PaymentModal modalVisible={modalVisible} onRequestClose={() => {}} cost={cost} code={code} closeModal={closeModal} />
      {/* <BottomTab /> */}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(84),
    marginTop: 'auto',
    width: wp(100),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: hp(3),
    borderTopRightRadius: hp(3),
    alignItems: 'center',
  },
  avatar: {
    width: wp(24.8),
    height: wp(24.8),
    borderRadius: 100,
    marginTop: -hp(8),
  },
  selectvistType: {
    height: hp(6.5),
    width: wp(76),
    marginTop: hp(6),
    borderRadius: hp(1.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#50BCBD',
    borderWidth: 1,
    flexDirection: 'row-reverse',
  },
});
export default memo(DoctorProfileScreen);
