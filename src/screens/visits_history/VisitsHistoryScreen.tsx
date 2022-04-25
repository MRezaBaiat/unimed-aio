import React, { useEffect, useState } from 'react';
import { QueryResponse, Transaction, User, UserType, Visit, VisitStatus } from 'api';
import VisitApi from '../../network/VisitApi';
import { useSelector } from 'react-redux';
import R from '../../assets/R';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppHeader from '../../components/composite/header/AppHeader';
import AppView from '../../components/base/app-view/AppView';
import AppEmptyList from '../../components/base/app-list-view/AppEmptyList';
import AppListView from '../../components/base/app-list-view/AppListView';
import BottomTab from '../../components/composite/bottom_tab/BottomTab';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import { hp } from '../../helpers/responsive-screen';
import AppCardRow from '../../components/composite/app_card_row/AppCardRow';
import AppActivityIndicator from '../../components/base/app-activity-indicator/AppActivityIndicator';
import dictionary from '../../assets/strings/dictionary';
import { StoreType } from '../../redux/Store';

interface Props {
  targetId?: string;
  navigation: any;
}
function VisitsHistoryScreen(props: Props) {
  const lang = useSelector<StoreType, string>((state) => state.userReducer.lang);
  const targetId = getScreenParam(props, 'targetId');
  const [query, setQuery] = useState(undefined as QueryResponse<Visit> | undefined);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const limit = 20;

  const load = () => {
    VisitApi.getVisitHistories(targetId, limit * index, limit)
      .then((res) => {
        setQuery({ ...res.data, results: [...(query ? query.results : []), ...res.data.results].uniquifyWith((a, b) => a._id === b._id) });
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(load, [index]);

  return (
    <AppContainer style={{ backgroundColor: '#50BCBD', flex: 1 }}>
      <AppHeader text={dictionary.visit_history} />
      <AppView style={R.styles.modalContainer}>
        {!query && <AppActivityIndicator color="#4E55A1" size="large" style={R.styles.spinner} />}
        {query && (!loaded || query.results.length === 0) && <AppEmptyList text={dictionary.no_visits_history_record} ImageUrl={R.images.TransActionHistoryEmpty} />}
        {query && loaded && query.results.length > 0 && (
          <AppListView
            onEndReached={() => {
              index < query.maxPageIndex && setIndex(index + 1);
            }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            onEndReachedThreshold={0.1}
            contentContainerStyle={{ paddingBottom: hp(15), alignItems: 'center' }}
            data={query.results}
            renderItem={(item) => <Row visit={item.item} lang={lang} />}
          />
        )}
      </AppView>

      <BottomTab focusedInput="2" />
    </AppContainer>
  );
}

interface RowProps {
  visit: Visit;
  lang: string;
}
const Row = (props: RowProps) => {
  const { visit, lang } = props;
  const user = useSelector<StoreType, User>((state) => state.userReducer.user);
  const isPatient = user.type === UserType.PATIENT;
  const imageUrl = isPatient ? visit.doctor && visit.doctor.imageUrl : visit.patient && visit.patient.imageUrl;
  const clickable = visit.state === VisitStatus.ENDED;
  const onClick = () => {
    console.log(visit);
    clickable &&
      AppNavigator.navigateTo('ChatHistoryDetails', {
        visitId: visit._id,
        imageUrl: imageUrl,
        title: isPatient ? (visit.doctor ? visit.doctor.name : 'پزشک حذف شده است') : visit.patient ? (visit.patient.name ? visit.patient.name : visit.patient.mobile.slice(0, 4) + '***' + visit.patient.mobile.slice(7, 14)) : 'بیمار حذف شده است',
        specialization: isPatient && visit.doctor ? visit.doctor.specialization.name : '',
      });
  };

  return (
    <AppCardRow
      onClick={clickable ? onClick : undefined}
      imageSrc={imageUrl}
      title={isPatient ? (visit.doctor ? visit.doctor.name : dictionary.deleted_doctor) : visit.patient ? (visit.patient.name && visit.patient.name !== 'Unknown' ? visit.patient.name : visit.patient.mobile.slice(0, 4) + '***' + visit.patient.mobile.slice(7, 14)) : 'Deleted patient'}
      /* subTitle={visit.doctor ? visit.doctor.specialization.name : ''} */
      date={visit.createdAt}
    />
  );
};

export default React.memo(VisitsHistoryScreen);
