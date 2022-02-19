/**
 ** https://github.com/tongyy/react-native-draggable
 *
 */

import React, { Component } from 'react';
import { Platform, View, Text, Image, PanResponder, Dimensions, TouchableOpacity, PanResponderInstance, GestureResponderEvent, PanResponderGestureState, ViewStyle, Animated, ImageStyle } from 'react-native';
import AppView from '../app-view/AppView';

export interface Props {
  dragXAllowed?: boolean;
  dragYAllowed?: boolean;
  renderText?: string;
  renderShape?: string;
  renderSize?: number;
  imageSource?: any;
  offsetX?: number;
  offsetY?: number;
  renderColor?: string;
  reverse?: boolean;
  pressDrag?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onMove?: (x: number, y: number) => void;
  pressDragRelease?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  longPressDrag?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  pressInDrag?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  pressOutDrag?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  z?: number;
  x?: number;
  y?: number;
  contentStyle?: ImageStyle;
}

export default class AppDraggable extends Component<Props> {
  static defaultProps = {
    dragXAllowed: true,
    dragYAllowed: true,
    offsetX: 100,
    renderShape: 'circle',
    renderColor: 'yellowgreen',
    renderText: '＋',
    renderSize: 36,
    offsetY: 100,
    reverse: true,
  };

  state = {
    pan: new Animated.ValueXY(),
    _value: { x: 0, y: 0 },
  };

  private panResponder: PanResponderInstance;

  componentWillMount() {
    if (this.props.reverse === false) {
      this.state.pan.addListener((c) => (this.state._value = c));
    }
  }

  componentWillUnmount() {
    // @ts-ignore
    this.state.pan.removeAllListeners();
  }

  constructor(props: Props) {
    super(props);
    const { pressDragRelease, reverse, onMove, pressInDrag, pressOutDrag, pressDrag } = props;
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        pressInDrag && pressInDrag();
        /* if (!reverse) {
            this.state.pan.setOffset({ x: this.state._value.x, y: this.state._value.y });
            this.state.pan.setValue({ x: 0, y: 0 });
          } */
      },
      onPanResponderMove: (e, gestureState) => {
        this.props.onMove && this.props.onMove(gestureState.dx, gestureState.dy);
        // return Animated.event([null, this.createEventConfig()], { listener: null, useNativeDriver: false })(e, gestureState);
        return gestureState.vx <= 0 ? null : Animated.event([null, { dx: this.state.pan.x }])(e, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        pressOutDrag && pressOutDrag();
        /* if (pressDragRelease) { pressDragRelease(e, gestureState); }
          if (!reverse) { this.state.pan.flattenOffset(); } else { this.reversePosition(); } */
      },
    });
  }

  private createEventConfig() {
    return {
      dx: this.props.dragXAllowed ? this.state.pan.x : new Animated.Value(0),
      dy: this.props.dragYAllowed ? this.state.pan.y : new Animated.Value(0),
      /* dx: this.props.dragXAllowed ? this.state.pan.x : undefined,
        dy: this.props.dragYAllowed ? this.state.pan.y : undefined */
    };
  }

  _positionCss = () => {
    const Window = Dimensions.get('window');
    const { renderSize, offsetX, offsetY, x, y, z } = this.props;
    return Platform.select({
      ios: {
        zIndex: z != null ? z : 999,
        position: 'absolute',
        top: y != null ? y : Window.height / 2 - renderSize + offsetY,
        left: x != null ? x : Window.width / 2 - renderSize + offsetX,
      },
      android: {
        position: 'absolute',
        width: Window.width,
        height: Window.height,
        top: y != null ? y : Window.height / 2 - renderSize + offsetY,
        left: x != null ? x : Window.width / 2 - renderSize + offsetX,
      },
    });
  };

  _dragItemCss = () => {
    const { renderShape, renderSize, renderColor } = this.props;
    if (renderShape === 'circle') {
      return {
        backgroundColor: 'renderColor',
        width: renderSize * 2,
        height: renderSize * 2,
        borderRadius: renderSize,
        justifyContent: 'center',
        alignItems: 'center',
      };
    } else if (renderShape === 'square') {
      return {
        backgroundColor: renderColor,
        width: renderSize * 2,
        height: renderSize * 2,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
      };
    } else if (renderShape === 'image') {
      return {
        width: renderSize,
        height: renderSize,
        justifyContent: 'center',
        alignItems: 'center',
      };
    }

    return null;
  };

  _dragItemTextCss = () => {
    const { renderSize } = this.props;
    return {
      marginTop: renderSize - 10,
      marginLeft: 5,
      marginRight: 5,
      textAlign: 'center',
      color: '#fff',
    };
  };

  _getTextOrImage = () => {
    const { renderSize, renderShape, renderText, imageSource } = this.props;
    return <AppView>{imageSource ? <Image style={this.props.contentStyle} source={imageSource} resizeMode={'stretch'} /> : <Text style={this._dragItemTextCss()}>{renderText}</Text>}</AppView>;
  };

  reversePosition = () => {
    Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
  };

  render() {
    const touchableContent = this._getTextOrImage();
    const { pressDrag, longPressDrag, pressInDrag, pressOutDrag } = this.props;

    return (
      <View style={this._positionCss()}>
        <Animated.View {...this.panResponder.panHandlers} style={this.state.pan.getLayout()}>
          <TouchableOpacity style={this._dragItemCss()} onPress={pressDrag} onLongPress={longPressDrag} onPressIn={pressInDrag} onPressOut={pressOutDrag}>
            {touchableContent}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
