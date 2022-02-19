import React, { Fragment, useEffect, useState } from 'react';
import { User, UserType, Visit, VisitStatus } from 'api';
import { useSelector } from 'react-redux';
import { ActivityIndicator, Modal } from 'react-native';
import VisitApi from '../network/VisitApi';
import AppView from '../components/base/app-view/AppView';
import { hp, wp } from '../helpers/responsive-screen';
import ModalHeader from '../components/composite/header/ModalHeader';
import AppEmptyList from '../components/base/app-list-view/AppEmptyList';
import R from '../assets/R';
import AppListView from '../components/base/app-list-view/AppListView';
import AppNavigator from '../navigation/AppNavigator';
import { formatDate, formatDateShamsi } from '../helpers';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import AppImageView from '../components/base/app-image/app-imageview';
import AppTextView from '../components/base/app-text-view/AppTextView';
import AppModal from '../components/base/app-modal/AppModal';
import dictionary from '../assets/strings/dictionary';
import useUser from '../hooks/useUser';
import useLang from '../hooks/useLang';

interface Props {
  targetId?: string;
  onRequestClose: () => void;
  modalVisible: boolean;
  closeModal: () => void;
  type: string;
}
function VisitsHistoryModal(props: Props) {
  const lang = useLang();
  const { targetId, onRequestClose, modalVisible, closeModal, type } = props;
  const [visits, setVisits] = useState([] as Visit[]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const limit = 20;

  const load = () => {
    VisitApi.getVisitHistories(targetId, limit * index, limit)
      .then((res) => {
        console.log(targetId, res);
        setVisits([...visits, ...res.data.results]);
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(load, [index]);

  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={true} visible={modalVisible}>
      <AppView
        style={[
          {
            height: hp(90),
            backgroundColor: '#FFFFFF',
            marginTop: hp(10),
            borderTopLeftRadius: hp(3),
            borderTopRightRadius: hp(3),
            alignItems: 'center',
          },
        ]}
      >
        <ModalHeader
          text={dictionary.visit_history}
          onClosePress={() => {
            closeModal();
          }}
        />
        {loaded ? (
          visits.length === 0 ? (
            <AppEmptyList text={dictionary.no_visits_history_record} ImageUrl={R.images.VisitHistoryEmpty} />
          ) : (
            <AppListView
              contentContainerStyle={{ paddingBottom: hp(15), marginTop: hp(3) }}
              data={visits}
              onEndReached={() => {
                setIndex(index + 1);
              }}
              onEndReachedThreshold={0.1}
              renderItem={(item) => (
                <Row
                  visit={item.item}
                  closeModal={() => {
                    closeModal();
                  }}
                  lang={lang}
                />
              )}
            />
          )
        ) : (
          <ActivityIndicator style={R.styles.spinner} size="large" color="#4E55A1" />
        )}
      </AppView>
    </AppModal>
  );
}

interface RowProps {
  visit: Visit;
  lang: string;
  closeModal: () => void;
}
const Row = (props: RowProps) => {
  const { visit, lang, closeModal } = props;
  const user = useUser();
  const isPatient = user.type === UserType.PATIENT;
  const imageUrl = isPatient ? visit.doctor && visit.doctor.imageUrl : visit.patient && visit.patient.imageUrl;
  const clickable = visit.state === VisitStatus.ENDED;
  const onClick = () => {
    // @ts-ignore
    AppNavigator.navigateTo('ChatHistoryDetails', {
      visitId: visit._id,
      imageUrl: imageUrl,
      title: isPatient ? (visit.doctor ? visit.doctor.name : 'پزشک حذف شده است') : visit.patient ? (visit.patient.name ? visit.patient.name : visit.patient.mobile.slice(0, 4) + '***' + visit.patient.mobile.slice(7, 14)) : 'بیمار حذف شده است',
      specialization: isPatient && visit.doctor ? visit.doctor.specialization.name : '',
      date: visit.createdAt ? formatDateShamsi(visit.createdAt).split('-')[1] : '',
    });
    closeModal();
  };

  return (
    <AppTouchable
      disabled={!clickable}
      onClick={onClick}
      style={{
        width: wp(92),
        height: hp(17),
        borderRadius: hp(1.2),
        borderWidth: 0.75,
        alignSelf: 'center',
        borderColor: clickable ? '#BDBDBD' : 'red',
        marginBottom: hp(1.2),
      }}
    >
      <AppView
        style={{
          height: hp(12.5),
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingStart: '4%',
        }}
      >
        <AppView style={{ borderRadius: 100 }}>{isPatient ? <AppImageView src={imageUrl} resizeMode="cover" style={{ height: hp(9.3), width: hp(9.3), borderRadius: 100 }} /> : <AppImageView src={imageUrl} resizeMode="cover" style={{ height: hp(9.3), width: hp(9.3), borderRadius: 100 }} />}</AppView>
        <AppView
          style={{
            height: '60%',
            width: '55%',
            marginRight: '4%',
            justifyContent: 'space-between',
          }}
        >
          {isPatient ? (
            <Fragment>
              <AppTextView
                style={{
                  fontFamily: R.fonts.fontFamily_faNum_Bold,
                  fontSize: wp(3.8),
                  color: '#4F4F4F',
                }}
                text={isPatient ? (visit.doctor ? visit.doctor.name : dictionary.deleted_doctor) : visit.patient.mobile.slice(0, 4) + '***' + visit.patient.mobile.slice(7, 14)}
              />
              <AppTextView textColor="#9f9f9f" fontSize={wp(3.3)} text={visit.doctor ? visit.doctor.name : ''} />
            </Fragment>
          ) : (
            <AppTextView
              style={{
                fontFamily: R.fonts.fontFamily_faNum_Bold,
                fontSize: wp(3.8),
                color: '#4F4F4F',
              }}
              text={visit.patient.name && visit.patient.name !== 'Unknown' ? visit.patient.name : visit.patient.mobile.slice(0, 4) + '***' + visit.patient.mobile.slice(7, 14)}
            />
          )}
        </AppView>
        <AppImageView
          style={{
            height: hp(2),
            width: hp(1.5),
            position: 'absolute',
            right: '6%',
          }}
          src={R.images.icons.arrow_left}
        />
      </AppView>
      <AppView
        style={{
          height: hp(4.3),
          backgroundColor: '#F2F2F2',
          borderBottomRightRadius: hp(1.2),
          borderBottomLeftRadius: hp(1.2),
          paddingHorizontal: '4%',
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}
      >
        <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={lang === 'fa' ? `${dictionary.date}: ${formatDateShamsi(visit.createdAt).split('-')[1]}` : formatDate(visit.createdAt)} fontSize={wp(3.3)} textColor={'#4F4F4F'} />
        {clickable ? <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={lang === 'fa' ? `${dictionary.hour}: ${formatDateShamsi(visit.createdAt).split('-')[0]}` : formatDate(visit.createdAt)} fontSize={wp(3.3)} textColor={'#4F4F4F'} /> : <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} textColor={'red'} text={visit.state} />}
      </AppView>
    </AppTouchable>
  );
};

export default React.memo(VisitsHistoryModal);
