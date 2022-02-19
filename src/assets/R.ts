import { hp, wp } from '../helpers/responsive-screen';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

export default {
  colors: require('./colors/colors').default,
  images: require('./images/images').default,
  strings: require('./strings/strings').default,
  animations: {
    caller_pulse: require('./AnimateJSONS/caller_pulse.json'),
    queue_anim: require('./AnimateJSONS/queue_anim.json'),
    logo_anim: require('./AnimateJSONS/logo_anim.json'),
    patient_waiting_anim: require('./AnimateJSONS/patient_waiting_anim.json'),
    doctor_queue_notify_anim: require('./AnimateJSONS/doctor_queue_notify_anim.json'),
  },
  sounds: {
    dial_tone: require('./dial_tone.mp3'),
    voice_visit_time_ended: require('./voice_visit_time_ended.mp3'),
  },
  fonts: {
    fontFamily: 'Shabnam',
    fontFamily_Bold: 'Shabnam-Bold',
    fontFamily_faNum: 'Shabnam-FD',
    fontFamily_faNum_Bold: 'Shabnam-Bold-FD',
  },
  fontsSize: {
    xsmall: wp(3),
    small: wp(3.3),
    large: wp(3.8),
    xLarg: wp(4.6),
  },

  styles: {
    container: {
      flexGrow: 1,
      width: wp(100),
      padding: wp(4),
      marginTop: hp(11),
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: hp(3),
      borderTopRightRadius: hp(3),
    },
    modalContainer: {
      height: hp(89),
      width: wp(100),
      marginTop: hp(11),
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: hp(3),
      borderTopRightRadius: hp(3),
      paddingVertical: wp(4),
    },
    commonButton: {
      width: wp(76),
      height: hp(6.5),
      backgroundColor: '#50BCBD',
      marginTop: hp(4),
      borderRadius: hp(1.2),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    } as ViewProps,
    spinner: {
      alignSelf: 'center',
      width: wp(100),
      height: hp(100),
      position: 'absolute',
      zIndex: 4,
      backgroundColor: 'rgba(0,0,0,.2)',
    } as StyleProp<ViewStyle>,
    bigCard: {
      cardView: {
        width: wp(92),
        height: hp(17),
        borderRadius: hp(1.2),
        alignSelf: 'center',
        marginBottom: hp(1.2),
      },
      cardTop: {
        height: hp(12.5),
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingStart: '4%',
      },
      textView: {
        height: '60%',
        width: '55%',
        marginRight: '4%',
        justifyContent: 'space-between',
      },
      cardBottom: {
        height: hp(4.3),
        backgroundColor: '#F2F2F2',
        borderBottomRightRadius: hp(1.2),
        borderBottomLeftRadius: hp(1.2),
        paddingHorizontal: '4%',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        alignItems: 'center',
      },
      avatar: {
        height: hp(2),
        width: hp(2),
        position: 'absolute',
        right: '6%',
      },
    },
  },
};
