import React, { useEffect, useState } from 'react';
import { QueryResponse, Transaction, TransactionType, User, UserType } from 'api';
import TransactionsApi from '../../network/TransactionsApi';
import R from '../../assets/R';
import dictionary from '../../assets/strings/dictionary';
import { useSelector } from 'react-redux';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppHeader from '../../components/composite/header/AppHeader';
import AppEmptyList from '../../components/base/app-list-view/AppEmptyList';
import AppView from '../../components/base/app-view/AppView';
import AppListView from '../../components/base/app-list-view/AppListView';
import BottomTab from '../../components/composite/bottom_tab/BottomTab';
import { numberWithCommas } from '../../helpers';
import { hp, wp } from '../../helpers/responsive-screen';
import Kit from 'javascript-dev-kit';
import AppCardRow from '../../components/composite/app_card_row/AppCardRow';
import AppActivityIndicator from '../../components/base/app-activity-indicator/AppActivityIndicator';
import useUser from '../../hooks/useUser';
import useLang from '../../hooks/useLang';

function TransactionsHistoryScreen() {
  const [query, setQuery] = useState(undefined as QueryResponse<Transaction> | undefined);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  console.log(query);
  const limit = 50;
  const load = () => {
    TransactionsApi.getTransactions(limit * index, limit)
      .then((res) => {
        setQuery({ ...res.data, results: [...(query ? query.results : []), ...res.data.results].uniquifyWith((a, b) => a._id === b._id) });
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(load, [index]);

  return (
    <AppContainer style={{ backgroundColor: '#38488A', flex: 1 }}>
      <AppHeader text={dictionary.transaction_history} />
      <AppView style={R.styles.modalContainer}>
        {!query && <AppActivityIndicator color="#4E55A1" size="large" style={R.styles.spinner} />}
        {query && (!loaded || query.results.length === 0) && <AppEmptyList text={dictionary.no_payment_history_record} ImageUrl={R.images.TransActionHistoryEmpty} />}
        {query && loaded && query.results.length > 0 && (
          <AppListView
            contentContainerStyle={{ paddingBottom: hp(15), alignItems: 'center' }}
            onEndReached={() => {
              index < query.maxPageIndex && setIndex(index + 1);
            }}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            data={query.results}
            renderItem={(item) => <Row transaction={item.item} />}
          />
        )}
      </AppView>
      <BottomTab />
    </AppContainer>
  );
}

interface RowProps {
  transaction: Transaction;
}
const Row = (props: RowProps) => {
  const { transaction } = props;
  const user = useUser();
  const lang = useLang();
  return (
    <AppCardRow
      title={detailedTextFromType(transaction.type, transaction)}
      subTitle={`${Kit.numbersToPersian(numberWithCommas(transaction.amount))} ${dictionary.toman}`}
      imageSrc={modeFromType(transaction.type, user) === 'deposit' ? R.images.icons.transactionDeposit : R.images.icons.transactionWith}
      date={transaction.createdAt}
      titleFontSize={R.fontsSize.small}
      subtitleFontSize={R.fontsSize.small}
      dateExtra={textFromType(transaction.type, user, lang)}
      avatarStyle={{
        marginRight: wp(3),
        width: wp(18),
        borderRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: '#D3D3D3',
        shadowOpacity: 0,
        shadowRadius: 0,
      }}
      resizeMode="contain"
    />
    /* <AppView style={R.styles.bigCard.cardView}>
      <AppView style={{ height: hp(12.5), flexDirection: 'row-reverse', alignItems: 'center', paddingStart: '4%' }}>
        <AppImageView src={modeFromType(transaction.type) === 'deposite' ? R.images.icons.transactionWith : R.images.icons.transactionDeposit} resizeMode='contain' style={{ width: hp(9.3), height: hp(9.3) }} />
        <AppView style={{ height: '50%', width: '55%', marginRight: '7%', justifyContent: 'center' }}>
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum, fontSize: R.fontsSize.small, color: '#4F4F4F', lineHeight: hp(3.5) }} text={detailedTextFromType(transaction.type, transaction)} />
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum, fontSize: R.fontsSize.small, color: '#4F4F4F' }}
            text={`${lang === 'fa' ? numberWithCommas(transaction.amount) : Kit.numbersToEnglish(numberWithCommas(transaction.amount))} ${dictionary.toman}`} />
        </AppView>
      </AppView>
      <AppView style={R.styles.bigCard.cardBottom}>
        <AppTextView text={textFromType(transaction.type, lang)} fontSize={R.fontsSize.small} textColor={'#38488A'} />
        <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={lang === 'fa' ? `تاریخ: ${date}` : dateToString(transaction.date)} fontSize={R.fontsSize.small} textColor={'#4F4F4F'} />
        <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={lang === 'fa' ? `ساعت: ${time}` : dateToString(transaction.date)} fontSize={R.fontsSize.small} textColor={'#4F4F4F'} />
      </AppView>
    </AppView> */
  );
};

const detailedTextFromType = (type, transaction: any) => {
  switch (type) {
    case TransactionType.CHARGE_BY_ADMIN:
      return dictionary.charge_by_admin;
    case TransactionType.CHARGE_BY_GATEWAY:
      return dictionary.payment_by_bank_portal;
    case TransactionType.STARTER_CHARGE:
      return dictionary.gift;
    case TransactionType.PAYROLL:
      return dictionary.for_salary;
    case TransactionType.VISIT_PAYMENT:
      return `${dictionary.visit_payment}\n${transaction.target.name}`;
    case TransactionType.RETURN_VISIT_PAYMENT:
      return `${dictionary.return_visit_payment}\n${transaction.issuer.name.substring(transaction.issuer.name.lastIndexOf('(') + 1, transaction.issuer.name.lastIndexOf(')'))}`;
    case TransactionType.REDUCE_BY_ADMIN:
      return dictionary.reduce_by_admin;
    case TransactionType.SERVICE_REQUEST_PAYMENT:
      return dictionary.service_request_payment;
    default:
      return 'unknown';
  }
};

const modeFromType = (type: TransactionsApi, user: User) => {
  switch (type) {
    case TransactionType.CHARGE_BY_ADMIN:
    case TransactionType.CHARGE_BY_GATEWAY:
    case TransactionType.STARTER_CHARGE:
    case TransactionType.PAYROLL:
      return 'deposit';
    case TransactionType.RETURN_VISIT_PAYMENT:
      return user.type === UserType.PATIENT ? 'deposit' : 'withdraw';
    case TransactionType.VISIT_PAYMENT:
      return user.type === UserType.PATIENT ? 'withdraw' : 'deposit';
    default:
      return 'withdraw';
  }
};

const textFromType = (type: TransactionType, user: User, lang: string) => {
  const mode = modeFromType(type, user);
  if (mode === 'deposit') {
    return dictionary.deposite;
  } else {
    return dictionary.withdraw;
  }
};

export default React.memo(TransactionsHistoryScreen);
