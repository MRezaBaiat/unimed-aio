import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const ChildItem = (props) => {
  const { style, onPress, index, item, imageKey, local, height } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(index)}>
      <Image resizeMode="contain" style={[styles.image, style, { height: height }]} source={local ? item[imageKey] : { uri: item[imageKey] }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  gallery: {
    resizeMode: 'contain',
  },
});
export default ChildItem;
