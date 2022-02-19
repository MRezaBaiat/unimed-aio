/**
 * Persian Calendar Picker Component
 *
 * Copyright 2016 Reza (github.com/rghorbani)
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
import React from 'react';
import { View } from 'react-native';

function EmptyDay(props) {
  const { styles } = props;
  return (
    <View style={styles.dayWrapper}>
      <View style={styles.dayButton} />
    </View>
  );
}

export default EmptyDay;
