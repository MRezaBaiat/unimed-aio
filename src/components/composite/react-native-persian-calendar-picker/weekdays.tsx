/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import R from '../../../assets/R';
import { wp } from '../../../helpers/responsive-screen';
import React from 'react';
import { Text, View } from 'react-native';
import Utils from './utils';

function Weekdays(props) {
  const { styles, startFromMonday, weekdays, textStyle } = props;
  let wd = weekdays;
  if (!wd) {
    wd = startFromMonday ? Utils.WEEKDAYS_MON : Utils.getWeekDays(); // English Week days Array
  }

  return (
    <View style={styles.dayLabelsWrapper}>
      {wd.map((day, key) => {
        return (
          <Text key={key} style={[styles.dayLabels, { fontSize: wp(2.8), fontFamily: R.fonts.fontFamily_faNum, color: '#38488A', textAlign: 'center' }]}>
            {day}
          </Text>
        );
      })}
    </View>
  );
}

export default Weekdays;
