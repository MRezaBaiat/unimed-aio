import React, { useEffect, useState } from 'react';
import { Visit } from 'api';
import R from '../../../assets/R';
import AppTextView from '../../base/app-text-view/AppTextView';
import { wp } from '../../../helpers/responsive-screen';
import { smartDate } from 'javascript-dev-kit';

interface Props {
  visit: Visit;
}
function VisitTimerView(props: Props) {
  const { visit } = props;
  const [remainingTime, setRemainingTime] = useState('');
  const [negative, setNegative] = useState(false);
  const [timeEnded, setTimeEnded] = useState(false);

  useEffect(() => {
    if (timeEnded) {
      const timerId = setInterval(
        (function fn() {
          playLocalSound('voice_visit_time_ended');
          return fn;
        })(),
        30000
      );
      return () => {
        clearInterval(timerId);
      };
    }
  }, [timeEnded]);
  useEffect(() => {
    const id = setInterval(() => {
      const now = smartDate().getTime();
      const start = smartDate(visit.createdAt).getTime();
      const duration = now - start;
      const remaining = visit.maxDurationMillisec - duration;
      const minutes = parseInt(String(remaining / 1000 / 60));
      const seconds = parseInt(String((remaining - minutes * 1000 * 60) / 1000));
      if (remaining <= 0) {
        setTimeEnded(true);
      }
      setNegative(minutes < 0 || seconds < 0);
      setRemainingTime(toDoubleDigits(minutes) + ':' + toDoubleDigits(Math.abs(seconds)));
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, []);

  return <AppTextView style={{ color: negative ? 'red' : '#38488A', fontSize: wp(4.1), fontFamily: R.fonts.fontFamily_faNum }} text={remainingTime} />;
}

const toDoubleDigits = (object: any) => {
  return String(object).length === 1 ? '0' + object : object;
};

export default VisitTimerView;
