import React, { useEffect } from 'react';
import R from '../../assets/R';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppButton from '../../components/base/app-button/AppButton';
import { wp } from '../../helpers/responsive-screen';
import { getScreenParam } from '../../navigation/AppNavigator';
import * as Font from 'expo-font';
import AppView from '../../components/base/app-view/AppView';

function PaymentDoneScreen(props) {
  console.log(props);
  // const urlParams = new URLSearchParams(props.location.search);
  const call = getScreenParam(props, 'call'); // urlParams.get('call');
  // const doctorCode = urlParams.get('doctorCode') || undefined;
  useEffect(() => {
    Font.loadAsync({
      [R.fonts.fontFamily]: {
        uri: require('../../assets/fonts/Gilroy-Light.otf'),
        display: Font.FontDisplay.SWAP,
      },
    });
  }, []);

  return (
    <AppContainer style={{ alignItems: 'center', justifyContent: 'space-evenly' }}>
      <AppImageView src={R.images.arm} style={{ width: wp(70), height: wp(70) }} />
      <AppView style={{ marginLeft: '5%', marginRight: '5%', alignItems: 'center', justifyContent: 'center' }}>
        <AppTextView text={'پرداخت با موفقیت انجام شد . لطفا برای بازگشت دکمه زیر را فشار دهید'} style={{ textAlign: 'center' }} />
        <AppButton
          text={'بازگشت به اپلیکیشن'}
          backgroundColor={'#50BCBD'}
          textColor={'white'}
          style={{ marginTop: 30, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, borderRadius: 10 }}
          onClick={() => {
            console.log(call);
            call && window.open(call, '_self');
            //  window.open('https://unimed.ir/profile', '_self');
            //  window.open('unimed://paymentdone', '_self');
          }}
        />
      </AppView>
    </AppContainer>
  );
}

export default React.memo(PaymentDoneScreen);
