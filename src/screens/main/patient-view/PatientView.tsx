import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { PatientStatus, VisitStatus } from 'api';
import StandardModeScreen from './StandardModeScreen';
import QueueModeScreen from './QueueModeScreen';
import AppNavigator from '../../../navigation/AppNavigator';
import useStatus from '../../../hooks/useStatus';

function PatientView({ initialCode }: { initialCode?: string }) {
  const status = useStatus();
  if (status.visit && status.visit.state === VisitStatus.STARTED) {
    if (AppNavigator.getTopScreen() !== 'ChatScreen') {
      AppNavigator.resetStackTo('ChatScreen');
    }
  }

  return status.visit ? <QueueModeScreen /> : <StandardModeScreen initialCode={initialCode} />;
}

export default memo(PatientView);
