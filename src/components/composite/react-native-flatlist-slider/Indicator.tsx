import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const Indicator = (props) => {
  const { itemCount, currentIndex, indicatorStyle, indicatorContainerStyle, indicatorActiveColor, indicatorInActiveColor, indicatorActiveWidth = 6 } = props;
  return <View style={[styles.container, indicatorContainerStyle]}>{renderIndicator(itemCount, currentIndex, indicatorStyle, indicatorActiveColor, indicatorInActiveColor, indicatorActiveWidth)}</View>;
};
export default memo(Indicator);

const renderIndicator = (count, currentIndex, indicatorStyle, indicatorActiveColor, indicatorInActiveColor, indicatorActiveWidth) => {
  const indicators = [];
  for (let i = 0; i < count; i++) {
    indicators.push(
      <View
        key={i.toString()}
        style={[
          styles.indicator,
          indicatorStyle,
          i === currentIndex
            ? indicatorActiveColor
              ? {
                  ...styles.active,
                  ...{
                    backgroundColor: indicatorActiveColor,
                    width: indicatorActiveWidth,
                  },
                }
              : styles.active
            : {
                ...styles.inactive,
                ...{ backgroundColor: indicatorInActiveColor },
              },
        ]}
      />
    );
  }
  return indicators;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  active: {},
  inactive: {},
});
