import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import dictionary from '../../assets/strings/dictionary';
import R from '../../assets/R';
import AuthService from '../../services/AuthService';
import ErrorHandler from '../../helpers/ErrorHandler';
import AppNavigator from '../../navigation/AppNavigator';
import AppView from '../../components/base/app-view/AppView';
import GlobalAlert from '../global_alert/GlobalAlert';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import { hp, wp } from '../../helpers/responsive-screen';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useIsFocused } from '@react-navigation/native';
import AppModal from '../../components/base/app-modal/AppModal';
import useLang from '../../hooks/useLang';

interface Props {
  onResend: () => void;
  onPress: (otp: string) => void;
  visible?: boolean;
  onClose: () => void;
  mobile: string;
}
function OTPModal(props: Props) {
  const { onPress, onResend, visible, onClose, mobile } = props;
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const lang = useLang();

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }
  }, [seconds]);
  const confirmOTP = (otp: string) => {
    AuthService.sendLoginOTP(otp)
      .then((res) => {
        onClose();
        AppNavigator.resetStackTo('IntroScreen');
      })
      .catch((err) => {
        setCodeError(true);
        ErrorHandler.handleError(err);
      });
  };
  const changeNumber = () => {
    setCodeError(false);
    setSeconds(60);
    onClose();
  };
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current &&
      setTimeout(() => {
        inputRef.current.focusField(0);
      }, 1000);
  }, [inputRef.current]);

  return (
    <AppModal animationType="slide" visible={visible} onRequestClose={onClose}>
      <AppView style={{ paddingHorizontal: hp(8.2) }}>
        {codeError && <GlobalAlert text={dictionary.otp_error} BgColor="red" />}
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_Bold,
            alignSelf: 'flex-end',
            marginTop: hp(12),
          }}
          textColor="#38488A"
          fontSize={wp(4.6)}
          text={dictionary.enter_otp}
        />
        <AppTextView
          style={{
            textAlign: 'center',
            alignSelf: 'flex-end',
            marginTop: hp(2),
            fontFamily: R.fonts.fontFamily_faNum,
          }}
          textColor="#666666"
          fontSize={wp(3.3)}
          text={dictionary.enter_6_digits_code}
        />
        {seconds === 0 && (
          <AppTouchable
            onClick={() => {
              changeNumber();
            }}
          >
            <AppTextView
              style={{
                fontFamily: R.fonts.fontFamily_faNum,
                alignSelf: 'flex-end',
                marginTop: hp(2),
              }}
              textColor="#50BCBD"
              fontSize={wp(3.8)}
              text={`${dictionary.change_number[lang]} ${mobile}`}
            />
          </AppTouchable>
        )}
        <OTPInputView
          style={{
            width: '80%',
            height: hp(10),
            alignSelf: 'center',
            marginTop: hp(8),
          }}
          ref={inputRef}
          pinCount={6}
          code={code}
          onCodeChanged={(code) => {
            code.length >= 5 && setCodeError(false);
            setCode(code);
          }}
          autoFocusOnLoad={false}
          codeInputFieldStyle={[
            Styles.underlineStyleBase,
            {
              borderColor: codeError ? 'red' : '#BDBDBD',
              color: codeError ? 'red' : '#50BCBD',
            },
          ]}
          codeInputHighlightStyle={{ borderColor: '#828282' }}
          onCodeFilled={(code) => {
            code.length === 6 && confirmOTP(code);
          }}
        />
        <AppTouchable
          disabled={seconds !== 0}
          onClick={() => {
            if (seconds > 0) {
              return;
            }
            onResend();
            setSeconds(60);
          }}
          style={[Styles.Button, { backgroundColor: seconds === 0 ? '#50BCBD' : '#BDBDBD' }]}
        >
          <AppTextView
            text={dictionary.resend_code}
            fontSize={wp(3.8)}
            style={{
              color: '#FFFFFF',
              fontFamily: R.fonts.fontFamily_faNum_Bold,
            }}
          />
        </AppTouchable>
        {seconds !== 0 && (
          <AppTextView
            text={`${String(seconds)}  ${dictionary.seconds_until_resubmission[lang]}`}
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              alignSelf: 'center',
              marginTop: hp(1.5),
            }}
            textColor="#50BCBD"
            fontSize={wp(3.8)}
          />
        )}
      </AppView>
    </AppModal>
  );
}
const Styles = StyleSheet.create({
  underlineStyleBase: {
    width: wp(8),
    height: hp(8),
    borderWidth: 0,
    borderBottomWidth: hp(0.15),
    fontSize: wp(6),
    fontFamily: R.fonts.fontFamily_faNum,
    borderColor: '#BDBDBD',
  },

  Button: {
    width: '87%',
    height: hp(6.5),
    marginTop: hp(5),
    borderRadius: hp(1.2),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default React.memo(OTPModal);
