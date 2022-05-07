import React, { useEffect, useState } from 'react';
import { PatientStatus, Specialization } from 'api';
import R from '../../assets/R';
import ChatService from '../../services/ChatService';
import VisitApi from '../../network/VisitApi';
import { useSelector } from 'react-redux';
import TransactionsApi from '../../network/TransactionsApi';
import { Keyboard, Linking, Text, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedbackBase, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import dictionary from '../../assets/strings/dictionary';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import ToastMaster from '../../helpers/ToastMaster';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppImageButton from '../../components/base/app-image-button/AppImageButton';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppView from '../../components/base/app-view/AppView';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppCardView from '../../components/base/app-card-view/AppCardView';
import Kit from 'javascript-dev-kit';
import AppTextInput from '../../components/base/app-text-input/AppTextInput';
import AppButton from '../../components/base/app-button/AppButton';
import { openURL } from '../../helpers';
import { wp } from '../../helpers/responsive-screen';
import { StoreType } from '../../redux/Store';

interface Props {
  cost: number;
  currency: number;
  name: string;
  specialization: Specialization;
  code: string;
}
function VisitCheckScreen(props: Props) {
  const { cost, currency, name, specialization, code } = getScreenParam(props);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [url, setUrl] = useState<string | undefined>();
  const payable = !discountAmount ? cost : cost - discountAmount < 0 ? 0 : cost - discountAmount;
  const lang = useSelector<StoreType, string>((state) => state.userReducer.lang);

  useEffect(() => {
    const listener = ({ url }) => {
      VisitApi.initiateVisit(code).then((res) => {
        AppNavigator.goBack();
        const { cost, currency, name, specialization, error } = res.data;
        if (error) {
          console.log(error);
          return alert(error);
        }
        AppNavigator.navigateTo('VisitCheckScreen', {
          cost,
          currency,
          name,
          specialization,
          code,
        });
      });
    };

    Linking.addEventListener('url', listener);

    return () => {
      Linking.removeEventListener('url', listener);
    };
  }, []);

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

  useEffect(() => {
    if (discountCode.length === 6) {
      VisitApi.getDiscountInfo(discountCode)
        .then((res) => {
          const { error, amount } = res.data;
          if (!amount) {
            Keyboard.dismiss();
            ToastMaster.makeText('کد تخفیف اشتباه می‌باشد');
            setDiscountAmount(amount || 0);
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
    <TouchableHighlight
      accessible={false}
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <AppContainer
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppImageButton style={{ position: 'absolute', zIndex: 1000, top: '2%', left: '2%', width: 35, height: 35 }} imageStyle={{ width: 15, height: 25 }} src={R.images.icons.back_green} onClick={AppNavigator.goBack} />
        <AppImageView style={{ width: wp(50), height: wp(50) }} src={R.images.visit_check_image} />
        <AppView
          style={{
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <AppView style={{ backgroundColor: '#50BCBD', height: 1, flex: 1 }} />

          <AppView style={{ alignItems: 'center', justifyContent: 'center' }}>
            <AppTextView text={name} textColor={'#4E55A1'} fontSize={25} style={{ marginRight: 5, marginLeft: 5 }} />
            <AppTextView text={specialization.name} textColor={'#50BCBD'} fontSize={15} style={{ marginRight: 5, marginLeft: 5, textAlign: 'center', width: '100%' }} />
          </AppView>
          <AppView style={{ backgroundColor: '#50BCBD', height: 1, flex: 1 }} />
        </AppView>

        <AppView style={{ width: '100%', marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
          <AppView style={{ backgroundColor: '#50BCBD', marginBottom: -5, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
            <AppTextView text={dictionary.pay_for_consultation} textColor={'white'} style={{ width: '50%', textAlign: 'center', padding: 10 }} />
          </AppView>
          <AppCardView style={{ width: '70%', paddingLeft: 30, paddingRight: 30, borderRadius: 15 }}>
            <AppView style={{ width: '100%', height: 50, flexDirection: lang === 'fa' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#4E55A1', borderBottomWidth: 1 }}>
              <AppTextView text={`${lang === 'fa' ? String(currency) : currency} ${dictionary.toman[lang]}`} textColor={'#50BCBD'} fontSize={14} />
              <AppTextView text={dictionary.your_credit} textColor={'#4E55A1'} fontSize={14} />
            </AppView>

            <AppView style={{ width: '100%', height: 50, flexDirection: lang === 'fa' ? 'row' : 'row-reverse', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#4E55A1', borderBottomWidth: 1 }}>
              <AppTextView text={`${lang === 'fa' ? String(payable) : payable} ${dictionary.toman[lang]}`} textColor={'#50BCBD'} />
              <AppTextView text={dictionary.payable_amount} textColor={'#4E55A1'} fontSize={14} />
            </AppView>

            <AppTextInput
              textStyle={{
                textAlign: 'center',
                fontSize: 15,
              }}
              keyboardType="number-pad"
              maxLength={6}
              value={discountCode}
              placeHolder={dictionary.discount_code}
              onChange={(text) => {
                setDiscountCode(text);
              }}
            />
          </AppCardView>
        </AppView>
        <AppButton
          text={currency >= payable ? dictionary.next : dictionary.pay}
          textColor={'white'}
          backgroundColor={'#4E55A1'}
          style={{
            width: '50%',
            marginLeft: '25%',
            marginRight: '25%',
            marginTop: 15,
            borderRadius: 15,
          }}
          onClick={() => {
            if (currency === undefined || payable === undefined) {
              return;
            }
            if (currency >= payable) {
              ChatService.requestVisit(code, discountCode);
              AppNavigator.goBack();
            } else {
              url && openURL(url, '_self');
            }
          }}
        />
      </AppContainer>
    </TouchableHighlight>
  );
}

export default React.memo(VisitCheckScreen);
