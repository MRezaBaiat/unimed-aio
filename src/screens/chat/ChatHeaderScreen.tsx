// @ts-nocheck
import React, { Fragment } from 'react';
import R from '../../assets/R';
import AppView from '../../components/base/app-view/AppView';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppImageButton from '../../components/base/app-image-button/AppImageButton';
import AppNavigator from '../../navigation/AppNavigator';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppButton from '../../components/base/app-button/AppButton';
import VisitTimerView from '../../components/composite/visit_timer/VisitTimerView';
import AppPermissions from '../../helpers/AppPermissions';
import { User, UserType, Visit } from 'api';
import dictionary from '../../assets/strings/dictionary';
import P2PRoom from '../video_call/v3/P2PRoom';

export default function ChatHeaderScreen({ hp, wp, imageUrl, isPatient, videoCallAllowed, visit, user, getTypingStatusText, callStream, setHistoryModalVisible, _confirmationModalVisible }: { visit: Visit; user: User; _confirmationModalVisible: () => boolean; setHistoryModalVisible: (visible: boolean) => void; hp: any; wp: any; isPatient: boolean; imageUrl?: string; videoCallAllowed: boolean; getTypingStatusText: () => string; callStream?: P2PRoom }) {
  return (
    <AppView>
      <AppView
        style={{
          width: '100%',
          height: hp(11),
          alignItems: 'center',
          flexDirection: 'row-reverse',
          backgroundColor: '#4E55A1',
        }}
      >
        <AppView style={{ flex: 3, flexDirection: 'row-reverse', alignItems: 'center' }}>
          <AppImageView
            resizeMode="cover"
            defaultImage={R.images.user_empty_view}
            src={imageUrl}
            style={{
              borderColor: 'white',
              borderWidth: 1,
              height: 50,
              width: 50,
              borderRadius: 100,
              marginRight: wp(3),
            }}
          />
          <AppView
            style={{
              flexDirection: 'column',
              height: '48%',
              alignContent: 'space-around',
              marginRight: hp(2),
            }}
          >
            {!isPatient ? (
              <AppView>
                <AppTextView
                  style={{
                    textAlign: 'right',
                    color: '#FFFFFF',
                    fontSize: wp(3.8),
                    fontFamily: R.fonts.fontFamily_faNum_Bold,
                  }}
                  text={visit.patient.name ? visit.patient.name : visit.patient.mobile.slice(0, 4) + '***' + visit.patient.mobile.slice(7, 14)}
                />
                <AppTextView
                  text={getTypingStatusText()}
                  style={{
                    textAlign: 'right',
                    color: '#FFFFFF',
                    fontSize: wp(3),
                  }}
                />
              </AppView>
            ) : (
              <Fragment>
                <AppTextView
                  style={{
                    textAlign: 'right',
                    color: '#FFFFFF',
                    fontSize: wp(3.8),
                    fontFamily: R.fonts.fontFamily_faNum_Bold,
                  }}
                  text={visit.doctor.name}
                  textColor={'white'}
                />
                {getTypingStatusText() ? (
                  <AppTextView
                    text={getTypingStatusText()}
                    style={{
                      textAlign: 'right',
                      color: '#FFFFFF',
                      fontSize: wp(3),
                    }}
                  />
                ) : (
                  <AppTextView
                    style={{
                      textAlign: 'right',
                      color: '#FFFFFF',
                      fontSize: wp(3),
                    }}
                    text={user._id === visit.patient._id ? (visit.doctor.specialization ? visit.doctor.specialization.name : '') : ''}
                  />
                )}
              </Fragment>
            )}
          </AppView>
        </AppView>
        <AppView
          style={{
            flex: 1.4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {!callStream && (
            <AppView
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: wp(5.5),
              }}
            >
              {videoCallAllowed && (
                <AppImageButton
                  src={R.images.icons.video_call}
                  resizeMode="contain"
                  imageStyle={{ height: hp(4.5), width: hp(4.5) }}
                  onClick={() => {
                    AppPermissions.isCameraOrMicrophoneBlocked().then((blocked) => {
                      if (!blocked) {
                        AppNavigator.navigateTo('CallScreen', {
                          visitId: visit._id,
                          type: 'video/audio',
                        });
                      } else {
                        AppPermissions.alertNoPermission(false);
                      }
                    });
                  }}
                />
              )}
              <AppImageButton
                src={R.images.icons.voice_call}
                imageStyle={{ height: hp(3.5), width: hp(3.5) }}
                onClick={() => {
                  AppPermissions.isMicrophoneBlocked().then((blocked) => {
                    if (!blocked) {
                      AppNavigator.navigateTo('CallScreen', {
                        visitId: visit._id,
                        type: 'audio',
                      });
                    } else {
                      AppPermissions.alertNoPermission(false);
                    }
                  });
                }}
              />
            </AppView>
          )}
          {callStream && (
            <AppTouchable
              onClick={() => {
                AppNavigator.navigateTo('CallScreen');
              }}
              style={{
                width: wp(25),
                height: hp(5),
                flexDirection: 'row',
                backgroundColor: '#50BCBD',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: hp(1.2),
                marginLeft: wp(5.5),
              }}
            >
              <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} fontSize={wp(3)} textColor="#FFFFFF" text={dictionary.talking} />
            </AppTouchable>
          )}
        </AppView>
      </AppView>
      {/* HeaderChat */}

      {/* SubHeaderChat */}
      <AppView
        style={{
          height: hp(8),
          width: wp(100),
          flexDirection: 'row-reverse',
          backgroundColor: '#DFE3F1',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: hp(1),
        }}
      >
        <AppButton
          text={dictionary['سوابق مشاوره']}
          textSize={hp(2)}
          textColor="#FFFFFF"
          style={{
            backgroundColor: '#50BCBD',
            flex: 1,
            marginLeft: 10,
            height: hp(5),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: hp(1.2),
          }}
          onClick={() => {
            setHistoryModalVisible(true);
          }}
        />
        {visit.maxDurationMillisec && visit.maxDurationMillisec !== 0 && <VisitTimerView visit={visit} />}
        {user.type === UserType.DOCTOR ? (
          <AppButton
            text={dictionary['پایان مشاوره']}
            textSize={hp(2)}
            textColor="#FFFFFF"
            style={{
              backgroundColor: '#50BCBD',
              flex: 1,
              marginRight: 10,
              height: hp(5),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: hp(1.2),
            }}
            onClick={() => {
              _confirmationModalVisible();
            }}
          />
        ) : (
          <AppView
            style={{
              flex: 1,
              marginRight: 10,
              height: hp(5),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: hp(1.2),
            }}
          />
        )}
      </AppView>
      {/* SubHeaderChat */}
    </AppView>
  );
}
