import React, { useEffect, useState } from 'react';
import { View, ViewProps, StyleSheet, ViewStyle, Dimensions, Pressable } from 'react-native';
import R from '../../../assets/R';
import AppTextView from '../../base/app-text-view/AppTextView';
import AppDraggable from '../../base/app-draggable/AppDraggable';
import VoiceRecorderServiceNative from '../../../services/voice-recorder/VoiceRecorderService';
import AppView from '../../base/app-view/AppView';
import AppImageView from '../../base/app-image/app-imageview';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTouchable from '../../base/app-touchable/AppTouchable';
import FileAsset from '../../../helpers/file-manager/FileAsset';
import dictionary from '../../../assets/strings/dictionary';
const dimensions = Dimensions.get('window');

const renderSize = 30;
const initialX = 0;

export interface Props extends ViewProps {
  targetId: string;
  onRecordComplete: (file: FileAsset | undefined) => void;
}

function TimerView() {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setDuration(duration + 100);
    }, 100);
  }, [duration]);

  const minutes = parseInt(String(duration / 1000 / 60), 2);
  const seconds = parseInt(String((duration - minutes * 1000 * 60) / 1000));
  const milliseconds = String(duration - minutes * 1000 * 60 - seconds * 1000).substr(0, 2);

  return <AppTextView text={toDoubleDigits(minutes) + ':' + toDoubleDigits(seconds) + ':' + toDoubleDigits(milliseconds)} textColor={'black'} style={{ marginLeft: 10 }} />;
}
const toDoubleDigits = (object: any) => {
  return String(object).length === 1 ? '0' + object : object;
};

export default class MicView extends React.Component<Props> {
  state = {
    style: styles.releasedStyle as ViewStyle,
    released: true,
    x: initialX,
    startTime: null,
    recordDuration: 0,
  };

  private mDragable: AppDraggable;
  private mContentView: AppView;
  private mRecorder: VoiceRecorderServiceNative;
  render() {
    return (
      <Pressable
        onPressOut={this.onRelease}
        style={[
          {
            justifyContent: 'center',
            backgroundColor: this.state.released ? undefined : 'white',
          },
          this.props.style,
        ]}
      >
        <View style={this.state.style}>
          {!this.state.released && (
            <AppView
              ref={(ref) => {
                this.mContentView = ref;
              }}
              style={{
                width: dimensions.width - renderSize * 2,
                height: 50,
                backgroundColor: 'white',
                position: 'absolute',
                left: 0,
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TimerView />
              <View
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <AppImageView style={{ height: hp(3), width: hp(3) }} src={R.images.icons.slidearrow} />
                <AppTouchable onClick={this.onRelease}>
                  <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={dictionary.drag_to_cancel} fontSize={wp(2)} textColor={'grey'} />
                </AppTouchable>
              </View>
            </AppView>
          )}
          <AppDraggable
            ref={(ref) => {
              this.mDragable = ref;
            }}
            dragYAllowed={false}
            renderSize={renderSize}
            offsetX={0}
            offsetY={0}
            x={this.state.x}
            y={0}
            imageSource={this.state.released ? R.images.icons.mic : R.images.icons.rec}
            pressInDrag={this.onPressIn}
            pressDragRelease={this.onRelease}
            contentStyle={{ height: hp(3.8), width: hp(3) }}
            onMove={this.onMove}
          />
        </View>
      </Pressable>
    );
  }

  private onPressIn = () => {
    console.log('press in');
    if (!this.state.released) {
      console.log(this.state.released, '1');
      return;
    }
    if (this.mRecorder) {
      console.log(this.mRecorder, '2');
      this.mRecorder.cancelRecord();
    }
    console.log('3', this.props.targetId);
    this.mRecorder = new VoiceRecorderServiceNative(this.props.targetId);
    this.mRecorder.startRecord();
    this.state.recordDuration = 0;
    this.state.startTime = new Date().getTime();
    this.state.style = styles.pressedStyle;
    this.state.x = dimensions.width - styles.releasedStyle.width;
    this.state.released = false;
    this.forceUpdate(() => {
      // this.mContentView.animate('slideInRight', 300, 0);
    });
  };

  private onMove = (x: number, y: number) => {
    console.log('move');
    if (Math.abs(x) >= 100 && !this.state.released) {
      this.state.style = styles.releasedStyle;
      this.state.x = initialX;
      this.state.released = true;
      this.forceUpdate();
      this.cancel();
    }
  };

  private onRelease = () => {
    console.log('release');
    if (this.state.released) {
      return;
    }
    this.state.style = styles.releasedStyle;
    this.state.x = initialX;
    this.state.released = true;
    this.state.startTime = null;
    this.forceUpdate();
    this.mRecorder.saveRecord(this.props.onRecordComplete);
    this.mRecorder = null;
  };

  private cancel = () => {
    console.log('cancelling');
    this.mRecorder.cancelRecord();
    this.mRecorder = null;
  };
}

const styles = StyleSheet.create({
  releasedStyle: {
    width: renderSize * 2,
    height: renderSize * 2,
    position: 'relative',
  },
  pressedStyle: {
    width: dimensions.width,
    height: renderSize * 2,
    position: 'absolute',
    right: initialX,
  },
});
