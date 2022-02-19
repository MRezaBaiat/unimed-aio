import React, { useEffect, useState } from 'react';
import { ViewStyle, Pressable, StyleProp, TouchableOpacity } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: any;
  onClick?: () => void;
  onLongClick?: () => void;
  disabled?: boolean;
}
function AppTouchable(props: Props) {
  const { onClick, onLongClick, children, disabled } = props;
  const [moved, setMoved] = useState(false);
  return (
    /* <Pressable {...props}
        onTouchMove={() => {
          setMoved(true);
        }}
        onPressIn={() => {
          setMoved(false);
        }}
        onPressOut={() => {
            console.log('press OUT')
          onClick && !moved && onClick();
        }}
        disabled={disabled} onLongPress={onLongClick}>
      {
        children
      }
    </Pressable> */
    <TouchableOpacity {...props} onPress={onClick} delayLongPress={20000} onLongPress={onLongClick} disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
}

export default React.memo(AppTouchable);
