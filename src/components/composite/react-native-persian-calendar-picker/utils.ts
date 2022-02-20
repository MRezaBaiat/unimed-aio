/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
import dictionary from '../../../assets/strings/dictionary';

const jMoment = require('jalali-moment');

export default {
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
  getWeekDays: () => [dictionary['شنبه'], dictionary['یکشنبه'], dictionary['دوشنبه'], dictionary['سه شنبه'], dictionary['چهارشنبه'], dictionary['پنج شنبه'], dictionary['جمعه']],
  getMonths: () => [dictionary['فروردین'], dictionary['اردیبهشت'], dictionary['خرداد'], dictionary['تیر'], dictionary['مرداد'], dictionary['شهریور'], dictionary['مهر'], dictionary['آبان'], dictionary['آذر'], dictionary['دی'], dictionary['بهمن'], dictionary['اسفند']],
  MAX_ROWS: 7,
  MAX_COLUMNS: 7,
  getDaysInMonth: function (month, year) {
    return jMoment.jDaysInMonth(year, month);
  },
};
