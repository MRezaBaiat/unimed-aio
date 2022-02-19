/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */

import AppImageView from '../../base/app-image/app-imageview';
import { hp } from '../../../helpers/responsive-screen';

const React = require('react');
const { Text, TouchableOpacity } = require('react-native');

function Controls({ styles, textStyles, label, onPressControl, icon }) {
  return (
    <TouchableOpacity onPress={() => onPressControl()}>
      {/* <Text style={[styles, textStyles]}>{label}</Text> */}
      <AppImageView resizeMode="contain" style={{ height: hp(2.5), width: hp(2) }} src={icon} />
    </TouchableOpacity>
  );
}

export default Controls;
