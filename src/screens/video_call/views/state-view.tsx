import React from 'react';
import AppCardView from '../../../components/base/app-card-view/AppCardView';
import AppView from '../../../components/base/app-view/AppView';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import AppActivityIndicator from '../../../components/base/app-activity-indicator/AppActivityIndicator';
import { DictRecord } from '../../../assets/strings/dictionary';

interface Props {
  text: string | DictRecord;
}
function StateView(props: Props) {
  const { text } = props;
  return (
    <AppView style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, alignItems: 'center', justifyContent: 'center' }}>
      <AppCardView style={{ borderRadius: 10 }}>
        <AppView style={{ backgroundColor: 'white', flexDirection: 'row-reverse', padding: 10, borderRadius: 10 }}>
          <AppTextView text={text} style={{ marginLeft: 15 }} />
          <AppActivityIndicator />
        </AppView>
      </AppCardView>
    </AppView>
  );
}

export default React.memo(StateView);
