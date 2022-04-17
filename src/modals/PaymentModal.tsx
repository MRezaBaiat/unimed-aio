import React, { useEffect, useState } from 'react';
import { Modal, Keyboard, Linking, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import VisitApi from '../network/VisitApi';
import ToastMaster from '../helpers/ToastMaster';
import AppView from '../components/base/app-view/AppView';
import ModalHeader from '../components/composite/header/ModalHeader';
import AppTextView from '../components/base/app-text-view/AppTextView';
import { hp, wp } from '../helpers/responsive-screen';
import AppTextInput from '../components/base/app-text-input/AppTextInput';
import R from '../assets/R';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import ChatService from '../services/ChatService';
import AppNavigator from '../navigation/AppNavigator';
import TransactionsApi from '../network/TransactionsApi';
import dictionary from '../assets/strings/dictionary';
import { numberWithCommas, openURL } from '../helpers';
import { User, UserType } from 'api';
import AppPermissions from '../helpers/AppPermissions';
import AppModal from '../components/base/app-modal/AppModal';
import { WhatsAppPayModal } from './whatsapp.pay.modal';

interface Props {
  onRequestClose: () => void;
  modalVisible: boolean;
  closeModal: () => void;
  cost: number;
  code: string;
}
function PaymentModal(props: Props) {
  const user: User = useSelector((state) => state.userReducer.user);
  console.log(user);
  const { onRequestClose, modalVisible, closeModal, cost, code } = props;
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [modalHeight, setModalHeight] = useState(55);
  const [url, setUrl] = useState(undefined);
  const [whatsappVisible, setWhatsappVisible] = useState(false);
  const [currency, setCurrency] = useState();
  const payable = !discountAmount ? cost : cost - discountAmount < 0 ? 0 : cost - discountAmount;
  const lang = useSelector((state) => state.userReducer.lang);

  useEffect(() => {
    if (currency === undefined || payable === undefined) {
      return;
    }
    if (currency >= payable) {
      setUrl(undefined);
    } else {
      setUrl(undefined);
      const amount = payable - currency < 1000 ? 1000 : payable - currency;
      TransactionsApi.getGatewayUrl(amount * 10, code)
        .then((res) => {
          setUrl(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [payable, currency]);

  console.log(props);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setModalHeight(80);
  };

  const _keyboardDidHide = () => {
    setModalHeight(60);
  };

  useEffect(() => {
    const listener = ({ url }) => {
      VisitApi.initiateVisit(code)
        .then((res) => {
          const { currency, error } = res.data;
          setCurrency(currency);
          if (error) {
            return console.log(error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    Linking.addEventListener('url', listener);

    return () => {
      Linking.removeEventListener('url', listener);
    };
  }, []);

  useEffect(() => {
    VisitApi.initiateVisit(code)
      .then((res) => {
        const { currency, error } = res.data;
        setCurrency(currency);
        if (error) {
          return console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (discountCode.length === 6) {
      VisitApi.getDiscountInfo(discountCode)
        .then((res) => {
          const { error, amount } = res.data;
          if (!amount) {
            Keyboard.dismiss();
            ToastMaster.makeText('کد تخفیف اشتباه می‌باشد');
            setDiscountAmount(amount);
            setDiscountCode('');
          }
          if (error) {
            return;
          }
          setDiscountAmount(Number(amount));
          Keyboard.dismiss();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setDiscountAmount(0);
    }
  }, [discountCode]);
  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent removeClippedSubviews visible={modalVisible}>
      <AppView style={[{ height: hp(modalHeight), marginTop: 'auto', backgroundColor: '#FFFFFF', borderTopLeftRadius: hp(3), borderTopRightRadius: hp(3), alignItems: 'center' }]}>
        <StatusBar hidden />
        <ModalHeader
          text={dictionary.pay_for_visit}
          closeColor="darkBlue"
          onClosePress={() => {
            closeModal();
          }}
        />
        <AppView style={{ height: hp(6.5), width: wp(76), marginTop: hp(4.5), borderRadius: hp(1.2), backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', paddingHorizontal: '4%' }}>
          <AppTextView style={{ fontSize: wp(3.8) }} textAlign="right" textColor="#38488A" text={`${dictionary.your_credit[lang]}`} />
          <AppTextView style={{ fontSize: wp(3.8), fontFamily: R.fonts.fontFamily_faNum }} textAlign="right" textColor="#38488A" text={`${numberWithCommas(String(currency))} ${dictionary.currency_unit[lang]} `} />
        </AppView>
        <AppView style={{ height: hp(6.5), width: wp(76), marginTop: hp(2.2), borderRadius: hp(1.2), backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', paddingHorizontal: '4%' }}>
          <AppTextView style={{ fontSize: wp(3.8) }} textAlign="right" textColor="#38488A" text={`${dictionary.visit_price[lang]}`} />
          <AppTextView style={{ fontSize: wp(3.8), fontFamily: R.fonts.fontFamily_faNum }} textAlign="right" textColor="#38488A" text={`${numberWithCommas(String(payable))} ${dictionary.currency_unit[lang]} `} />
        </AppView>
        <AppTextInput
          style={{ height: hp(6.5), width: wp(76), marginTop: hp(2.2), borderRadius: hp(1.2), borderWidth: 1, borderColor: '#38488A', paddingHorizontal: wp(2) }}
          textStyle={{ textAlign: 'center', color: '#4f4f4f', fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.8), textAlignVertical: 'top' }}
          keyboardType="default"
          maxLength={6}
          value={discountCode}
          placeholderTextColor="#BDBDBD"
          placeHolder={dictionary['ورود کد تخفیف']}
          onChange={(text) => {
            setDiscountCode(text);
          }}
        />
        <AppTouchable
          onClick={() => {
            if (currency === undefined || payable === undefined) {
              return;
            }
            if (currency >= payable) {
              AppPermissions.checkPermissions().then((granted) => {
                if (granted) {
                  ChatService.requestVisit(code, discountCode);
                  AppNavigator.navigateTo('MainScreen');
                }
              });
            } else {
              setWhatsappVisible(true);
              // url && openURL(url, '_self');
            }
          }}
          style={{ height: hp(6.5), width: wp(76), marginTop: hp(2.2), borderRadius: hp(1.2), backgroundColor: '#38488A', alignItems: 'center', justifyContent: 'center' }}
        >
          <AppTextView text={currency >= payable ? dictionary.next : dictionary.pay} fontSize={wp(3.8)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
      </AppView>
      {whatsappVisible && <WhatsAppPayModal onRequestClose={() => setWhatsappVisible(false)} />}
    </AppModal>
  );
}

export default React.memo(PaymentModal);
