/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import React from 'react';
import R from '../../../assets/R';
import { wp } from '../../../helpers/responsive-screen';
import { Platform, Text, View } from 'react-native';
import Utils from './utils';
import Controls from './controls';

function HeaderControls(props) {
  const { styles, currentMonth, currentYear, onPressNext, onPressPrevious, months, previousTitle, nextTitle, textStyle, headingLevel } = props;
  const MONTHS = months || Utils.getMonths(); // English Month Array
  // getMonth() call below will return the month number, we will use it as the
  // index for month array in english
  const previous = previousTitle || '>';
  const next = nextTitle || '<';
  const month = MONTHS[currentMonth];
  const year = currentYear;

  const accessibilityProps = { accessibilityRole: 'header' };
  if (Platform.OS === 'web') {
    accessibilityProps['aria-level'] = headingLevel;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row-reverse',
        alignSelf: 'center',

        justifyContent: 'space-between',
        width: '88%',
      }}
    >
      <Controls
        // label={previous}
        icon={R.images.icons.slidearrowrightblue}
        onPressControl={onPressPrevious}
        styles={[styles.monthSelector, styles.prev]}
        textStyles={textStyle}
      />

      <View>
        <Text style={[styles.monthLabel, { fontSize: wp(3.3), fontFamily: R.fonts.fontFamily_faNum_Bold, color: '#38488A' }]} {...accessibilityProps}>
          {month} {year}
        </Text>
      </View>

      <Controls
        // label={next}
        icon={R.images.icons.slidearrowleftblue}
        onPressControl={onPressNext}
        styles={[styles.monthSelector, styles.next]}
        textStyles={textStyle}
      />
    </View>
  );
}

export default HeaderControls;
