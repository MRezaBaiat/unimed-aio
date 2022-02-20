import React, { useState } from 'react';
import { StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import R from '../../assets/R';
import { User } from 'api';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppImageView from '../../components/base/app-image/app-imageview';
import { hp, wp } from '../../helpers/responsive-screen';
import AppNavigator from '../../navigation/AppNavigator';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppView from '../../components/base/app-view/AppView';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import dictionary from '../../assets/strings/dictionary';
import useUser from '../../hooks/useUser';

function IntroScreen() {
  const user = useUser();
  const isPatient = user.type === 'PATIENT';
  const IntroData = isPatient
    ? [
        { id: 0, title: dictionary['ارتباط تصویری مستقیم با پزشک'], text: dictionary['با اپلیکیشن یونیمد می‌توانید از طریــق ارتباط تصویری، صوتی و متنی به صورت مستقیم با دکتر خود در ارتباط باشید.'], image: R.images.intro.patient1 },
        { id: 1, title: dictionary['دریافت نوبت حضوری'], text: dictionary['می‌توانید از طریق نوبت حضوری در یونیمد از پزشکان منتخب در سراسر کشور نوبت بگیرید.'], image: R.images.intro.patient2 },
        { id: 2, title: dictionary['خدمات پزشکی و پرستاری در منزل'], text: dictionary['تمامی خدمات پزشکی و پرستاری اعم از ویزیت پزشک، تصویربرداری پزشکی، تزریقات و... را از طریق یونیمد در منزل انجام دهید.'], image: R.images.intro.patient3 },
      ]
    : [
        { id: 0, title: dictionary['پیگیری‌های بعد از درمان بیماران'], text: dictionary['با اپلیکیشن یونیمد می‌توانید از طریــق ارتباط تصویری، صوتی و متنی به صورت مستقیم با بیمار خود در ارتباط باشید.'], image: R.images.intro.doctor1 },
        { id: 1, title: dictionary['نوبت‌دهی حضوری به بیماران'], text: dictionary['بیماران می‌توانند از طریق دریافت نوبت حضوری در یونیمد از پزشکان منتخب در سراسر کشور نوبت بگیرند.'], image: R.images.intro.doctor2 },
        { id: 2, title: dictionary['خرید تجهیزات پزشکی'], text: dictionary['‌پزشکان از طریق فروشگاه یونیمد می‌توانند نسبت به خرید تجهیزات پزشکی مورد نیاز خود اقدام نمایند.'], image: R.images.intro.doctor3 },
      ];
  const [introSelected, setIntroSelected] = useState(0);

  const _nextPage = () => {
    introSelected < 2 ? setIntroSelected(introSelected + 1) : AppNavigator.resetStackTo('MainScreen');
  };

  return (
    <AppContainer scrollable style={{ flex: 1, alignItems: 'center' }}>
      <AppImageView style={{ width: wp(48), height: wp(48), marginTop: hp(15), alignSelf: 'center' }} resizeMode="contain" src={IntroData[introSelected].image} />
      <AppTextView style={{ fontFamily: R.fonts.fontFamily_Bold, fontSize: R.fontsSize.xLarg, marginTop: hp(10), textAlign: 'center' }} fontSize={wp(6)} textColor="#38488A" text={IntroData[introSelected].title} />
      <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum, fontSize: R.fontsSize.large, marginTop: hp(3), textAlign: 'center', lineHeight: hp(4) }} fontSize={wp(3.8)} textColor="#9e9e9e" text={IntroData[introSelected].text} />
      <AppView style={{ alignSelf: 'center', marginTop: '8%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
        <FlatList contentContainerStyle={{ justifyContent: 'space-between', width: '15%' }} horizontal data={IntroData} renderItem={({ item }) => <AppView style={{ height: hp(1.2), width: hp(1.2), borderRadius: 100, backgroundColor: item.id === introSelected ? '#38488A' : '#C4C4C4' }} />} />
      </AppView>
      <AppTouchable
        onClick={() => {
          _nextPage();
        }}
        style={R.styles.commonButton}
      >
        <AppTextView text={introSelected >= 2 ? dictionary.enter : dictionary.next} fontSize={R.fontsSize.large} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold }} />
      </AppTouchable>
    </AppContainer>
  );
}

export default React.memo(IntroScreen);
