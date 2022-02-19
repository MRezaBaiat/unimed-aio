import React, { useState } from 'react';
import { Rating, Visit } from 'api';
import R from '../../../assets/R';
import UserApi from '../../../network/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetFinalizableVisits } from '../../../redux/actions/users_actions';
import dictionary from '../../../assets/strings/dictionary';
import { ScrollView } from 'react-native-gesture-handler';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppContainer from '../../../components/base/app-container/AppContainer';
import AppImageView from '../../../components/base/app-image/app-imageview';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import AppView from '../../../components/base/app-view/AppView';
import StepIndicator from 'react-native-step-indicator';
import AppTouchable from '../../../components/base/app-touchable/AppTouchable';
import AppNavigator from '../../../navigation/AppNavigator';

interface Props {
  visit: Visit;
}

function PatientPostVisit(props: Props) {
  const labels = ['ضعیف', 'متوسط', 'خوب', 'عالی'];
  const customStyles = {
    stepIndicatorSize: hp(2.5),
    currentStepIndicatorSize: hp(2.5),
    separatorStrokeWidth: hp(0.7),
    currentStepStrokeWidth: 0,
    stepStrokeCurrentColor: '#FFFFFF',
    stepStrokeWidth: 0,
    stepStrokeFinishedColor: 'blue',
    stepStrokeUnFinishedColor: 'green',
    separatorFinishedColor: '#50BCBD',
    separatorUnFinishedColor: '#E5F3F3',
    stepIndicatorFinishedColor: '#50BCBD',
    stepIndicatorUnFinishedColor: '#E5F3F3',
    stepIndicatorCurrentColor: '#50BCBD',
    stepIndicatorLabelFontSize: 1,
    currentStepIndicatorLabelFontSize: 1,
    labelColor: '#50BCBD',
    labelSize: hp(2),
    currentStepLabelColor: '#50BCBD',
    labelFontFamily: R.fonts.fontFamily,
  };

  const visit = props.visit;
  const dispatch = useDispatch();
  const [rating, setRating] = useState<Rating>({
    _id: undefined as any,
    doctorDetailedConsequences: 0,
    doctorDetailsClearity: 0,
    doctorSolutions: 0,
    environmentDetails: 0,
    serviceQuality: 0,
    videoCallSatisfaction: 0,
    visitId: visit._id,
  });
  return (
    <AppContainer style={{ alignItems: 'center', backgroundColor: '#38488A' }}>
      <AppImageView
        resizeMode="contain"
        style={{
          height: wp(23),
          width: wp(23),
          marginTop: hp(4.4),
          position: 'absolute',
        }}
        src={R.images.icons.survey_icon}
      />
      <ScrollView
        style={{
          backgroundColor: '#FFFFFF',
          height: hp(84),
          marginTop: hp(16),
          bottom: 0,
          width: wp(100),
          borderTopLeftRadius: hp(3),
          borderTopRightRadius: hp(3),
        }}
      >
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_Bold,
            marginTop: '10%',
            alignSelf: 'center',
          }}
          textColor="#38488A"
          fontSize={wp(4.6)}
          text={dictionary.survey}
        />
        <AppView
          style={{
            width: '100%',
            height: hp(15),
            justifyContent: 'space-between',
            marginTop: hp(3),
          }}
        >
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              alignSelf: 'center',
            }}
            textColor="#38488A"
            fontSize={wp(3.8)}
            text={dictionary.survey_question_1}
          />
          <StepIndicator customStyles={customStyles} currentPosition={rating.serviceQuality === 0 ? undefined : rating.serviceQuality - 1} labels={labels} onPress={(rate) => setRating({ ...rating, serviceQuality: rate + 1 })} stepCount={4} />
        </AppView>
        <AppView
          style={{
            width: '100%',
            height: hp(15),
            justifyContent: 'space-between',
            marginTop: hp(3),
          }}
        >
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              alignSelf: 'center',
            }}
            textColor="#38488A"
            fontSize={wp(3.8)}
            text={dictionary.survey_question_2}
          />
          <StepIndicator customStyles={customStyles} currentPosition={rating.videoCallSatisfaction === 0 ? undefined : rating.videoCallSatisfaction - 1} labels={labels} onPress={(rate) => setRating({ ...rating, videoCallSatisfaction: rate + 1 })} stepCount={4} />
        </AppView>
        <AppView
          style={{
            width: '100%',
            height: hp(15),
            justifyContent: 'space-between',
            marginTop: hp(3),
          }}
        >
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              alignSelf: 'center',
            }}
            textColor="#38488A"
            fontSize={wp(3.8)}
            text={dictionary.survey_question_3}
          />
          <StepIndicator customStyles={customStyles} currentPosition={rating.doctorDetailsClearity === 0 ? undefined : rating.doctorDetailsClearity - 1} labels={labels} onPress={(rate) => setRating({ ...rating, doctorDetailsClearity: rate + 1 })} stepCount={4} />
        </AppView>
      </ScrollView>
      <AppTouchable
        disabled={!!(!rating.doctorDetailsClearity || !rating.serviceQuality || !rating.videoCallSatisfaction)}
        onClick={() => {
          UserApi.sendPostVisit_Patient(rating)
            .then((res) => {
              dispatch(actionSetFinalizableVisits(res.data));
              AppNavigator.resetStackTo('MainScreen');
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        style={{
          height: hp(6.5),
          width: wp(76),
          backgroundColor: '#38488A',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: hp(1.2),
          bottom: hp(7),
          position: 'absolute',
        }}
      >
        <AppTextView
          text={dictionary.submit_comment}
          fontSize={wp(3.3)}
          style={{
            color: '#FFFFFF',
            fontFamily: R.fonts.fontFamily_Bold,
            textAlign: 'center',
          }}
        />
      </AppTouchable>
    </AppContainer>
  );
}

export default React.memo(PatientPostVisit);

const styles = {
  selected: {
    width: hp(3),
    height: hp(3),
    borderRadius: 30,
    borderColor: '#50BCBD',
    borderWidth: 1,
    backgroundColor: '#50BCBD',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  unselected: {
    width: hp(3),
    height: hp(3),
    backgroundColor: '#D0D0D0',
    borderRadius: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
};
