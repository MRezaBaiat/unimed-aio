//@ts-nocheck
import React, { Fragment, memo, useEffect, useMemo, useState } from 'react';
import UserApi from '../../network/UserApi';
import { Helper, WorkTime } from 'api';
import R from '../../assets/R';
import AppNavigator from '../../navigation/AppNavigator';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppHeader from '../../components/composite/header/AppHeader';
import AppView from '../../components/base/app-view/AppView';
import AppListView from '../../components/base/app-list-view/AppListView';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import { hp, wp } from '../../helpers/responsive-screen';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppTextInput from '../../components/base/app-text-input/AppTextInput';
import Kit from 'javascript-dev-kit';
import AppActivityIndicator from '../../components/base/app-activity-indicator/AppActivityIndicator';
import moment from 'jalali-moment';
import { StyleSheet, ViewProps } from 'react-native';
import ResponseTime from 'api/dist/src/models/response_time/ResponseTime';
import dictionary from '../../assets/strings/dictionary';

function DoctorWorkTimeSettingScreen() {
  const [workTime, setWorkTime] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [daySelected, setDaySelected] = useState('');
  const [fetching, setFetching] = useState(true);

  const canUpdate = useMemo(() => {
    const now = moment();
    return now.hour() >= 9 && now.hour() < 23;
  }, []);

  useEffect(() => {
    UserApi.getMyWorkTimes()
      .then((res) => {
        setWorkTime(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const _sortDay = (day) => {
    switch (day) {
      case '0':
        return '6';
      case '6':
        return '5';
      case '5':
        return '4';
      case '4':
        return '3';
      case '3':
        return '2';
      case '2':
        return '1';
      case '1':
        return '0';
      default:
        break;
    }
  };

  const _deleteWorkTime = (WT, day) => {
    const thisWorkTime = workTime[String(day)];
    thisWorkTime.splice(thisWorkTime.indexOf(WT), 1);
  };

  const _addWorkTime = (day) => {
    const wt = { ...workTime };
    wt[day].push({ from: { hour: '00', minute: '00' }, to: { hour: '00', minute: '00' } });
  };

  const patchWorkTime = () => {
    if (!canUpdate) {
      alert('به روز رسانی زمان پاسخگویی تنها بین ساعات 9 تا 23 امکان پذیر است');
      return;
    }
    UserApi.updateMyWorkTimes(workTime)
      .then((res) => {
        AppNavigator.goBack();
        setFetching(!fetching);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AppContainer style={{ backgroundColor: '#50BCBD', flex: 1 }}>
      <AppHeader text={dictionary['انتخاب زمان مشاوره آنلاین']} />
      <AppView style={R.styles.container}>
        {loaded ? (
          <AppListView
            data={Object.keys(workTime)}
            extraData={fetching}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item }) => {
              const sortDay = _sortDay(item);
              const values = workTime[sortDay] as any[];
              return (
                <AppView>
                  {values.length > 0
                    ? values.map((wt, index) => {
                        const updateWT = (newWT) => {
                          const newValues = [...values];
                          newValues.splice(values.indexOf(wt), 1, newWT);
                          setWorkTime({ ...workTime, ...{ [sortDay]: newValues } });
                        };
                        return <Row wt={wt} addWT={_addWorkTime} updateWT={updateWT} index={index} day={sortDay} selected={daySelected} onDaySelected={setDaySelected} onDelete={_deleteWorkTime} />;
                      })
                    : renderDisabled({
                        day: sortDay,
                        daySelected,
                        updateWT: (newWT) => {
                          const newValues = [...values];
                          newValues.push(newWT);
                          setWorkTime({ ...workTime, ...{ [sortDay]: newValues } });
                        },
                      })}
                </AppView>
              );
            }}
          />
        ) : (
          <AppActivityIndicator color="#4E55A1" size="large" style={R.styles.spinner} />
        )}
        <AppTouchable
          onClick={() => {
            patchWorkTime();
          }}
          style={{
            height: hp(6.5),
            width: wp(76),
            backgroundColor: '#38488A',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: hp(1.2),
            alignSelf: 'center',
            marginTop: hp(2),
          }}
        >
          <AppTextView text={dictionary['ثبت']} fontSize={wp(3.8)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
      </AppView>
    </AppContainer>
  );
}

const Row = ({ wt, updateWT, index, day, selected, onDaySelected, onDelete, addWT }) => {
  const [state, setState] = useState('normal' as 'normal' | 'editable');
  return state === 'normal' ? renderNormal({ wt, updateWT, index, day, expanded: day + index === selected, onDaySelected, onDelete, addWT }) : renderEditable(wt, index, day, selected, onDaySelected, onDelete);
};

const renderNormal = ({ wt, updateWT, index, day, expanded, onDaySelected, onDelete, addWT }: any) => {
  return (
    <AppView
      style={[
        styles.enable,
        {
          height: expanded ? hp(19.5) : hp(6.5),
        },
      ]}
    >
      <AppView
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          paddingHorizontal: wp(14),
          flex: 0.8,
          borderBottomColor: '#9E9E9E',
          borderBottomWidth: expanded ? 1 : 0,
        }}
      >
        <AppTouchable
          onClick={() => {
            // setWT(originalWT);
            if (expanded) {
              onDaySelected(undefined);
            } else {
              onDaySelected(day + index);
            }
          }}
          style={{
            position: 'absolute',
            right: wp(4),
            height: wp(6),
            width: wp(6),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppImageView
            resizeMode="contain"
            style={{
              width: wp(4),
              height: wp(4),
            }}
            src={R.images.icons.arrow_down}
          />
        </AppTouchable>
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_faNum_Bold,
            fontSize: wp(3.3),
            flex: 1,
          }}
          textAlign="right"
          textColor="#38488A"
          text={Helper.dayNumberToString(day,'az')}
        />

        {expanded ? (
          <AppView
            style={{
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <HourTimeInput from={true} rt={wt} onUpdate={(res) => updateWT(res)} />
            <AppTextView style={styles.timeText} text=":" />
            <MinuteTimeInput from={true} rt={wt} onUpdate={(res) => updateWT(res)} />
            <AppTextView style={styles.timeText} text={dictionary['تا']} />
            <HourTimeInput from={false} rt={wt} onUpdate={(res) => updateWT(res)} />
            <AppTextView style={styles.timeText} text=":" />
            <MinuteTimeInput from={false} rt={wt} onUpdate={(res) => updateWT(res)} />
          </AppView>
        ) : (
          <AppView
            style={{
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <AppTextView style={styles.timeText} text={`${wt.from.hour}:${wt.from.minute}`} />
            <AppTextView style={styles.timeText} text={dictionary['تا']} />
            <AppTextView style={styles.timeText} text={`${wt.to.hour}:${wt.to.minute}`} />
          </AppView>
        )}
      </AppView>
      {expanded && (
        <Fragment>
          <AppTouchable
            onClick={() => {
              onDelete(wt, day);
              onDaySelected(undefined);
            }}
            style={{
              flex: 0.6,
              alignItems: 'center',
              marginTop: hp(2),
              flexDirection: 'row-reverse',
            }}
          >
            <AppImageView
              resizeMode="contain"
              style={{
                width: wp(4),
                height: wp(4),
                marginRight: wp(4),
              }}
              src={R.images.icons.close_red}
            />
            <AppTextView
              style={{
                textAlign: 'right',
                width: '100%',
                color: '#9E9E9E',
                fontSize: wp(3.3),
                marginRight: wp(6),
              }}
              text={dictionary['حذف ساعت روز انتخاب شده']}
            />
          </AppTouchable>
          <AppTouchable
            onClick={() => {
              addWT(day);
              onDaySelected(undefined);
            }}
            style={{
              flex: 0.6,
              marginBottom: hp(2),
              alignItems: 'center',
              flexDirection: 'row-reverse',
            }}
          >
            <AppImageView
              resizeMode="contain"
              style={{
                width: wp(4),
                height: wp(4),
                marginRight: wp(4),
              }}
              src={R.images.icons.attachment}
            />
            <AppTextView
              style={{
                textAlign: 'right',
                width: '100%',
                color: '#9E9E9E',
                fontSize: wp(3.3),
                marginRight: wp(6),
              }}
              text={dictionary['افزودن ساعت بیشتر در این روز']}
            />
          </AppTouchable>
        </Fragment>
      )}
    </AppView>
  );
};

const renderDisabled = ({ day, onDaySelected, updateWT }) => {
  return (
    <AppTouchable
      style={styles.disable}
      onClick={() => {
        updateWT({
          from: {
            hour: '00',
            minute: '00',
          },
          to: {
            hour: '00',
            minute: '00',
          },
        });
      }}
    >
      <AppTextView
        style={{
          fontFamily: R.fonts.fontFamily_faNum,
          fontSize: wp(3.3),
          flex: 1,
        }}
        textAlign="right"
        textColor="#4f4f4f"
        text={Helper.dayNumberToString(day, 'az')}
      />

      <AppTextView
        style={{
          flex: 2,
          textAlign: 'center',
          color: '#9E9E9E',
          fontSize: wp(3.3),
        }}
        text={dictionary['انتخاب نشده']}
      />
    </AppTouchable>
  );
};

const MinuteTimeInput = ({ rt, onUpdate, from }: { rt: ResponseTime; onUpdate: (rt: ResponseTime) => void; from: boolean }) => {
  return (
    <AppTextInput
      style={{ ...styles.timeText }}
      textStyle={{ fontSize: wp(3.3), fontFamily: R.fonts.fontFamily_faNum }}
      keyboardType="number-pad"
      maxLength={2}
      value={from ? rt.from.minute : rt.to.minute}
      onChange={(value) => {
        const numreg = /^[0-9]+$/;

        const minute = numreg.test(Kit.numbersToEnglish(value)) && parseInt(value) <= 59 ? value : '';
        if (from) {
          onUpdate({ ...rt, from: { hour: rt.from.hour, minute: minute } });
        } else {
          onUpdate({ ...rt, to: { hour: rt.to.hour, minute: minute } });
        }
      }}
    />
  );
};

const HourTimeInput = ({ rt, onUpdate, from }: { rt: ResponseTime; onUpdate: (rt: ResponseTime) => void; from: boolean }) => {
  return (
    <AppTextInput
      style={{ ...styles.timeText }}
      textStyle={{ fontSize: wp(3.3), fontFamily: R.fonts.fontFamily_faNum }}
      value={from ? rt.from.hour : rt.to.hour}
      maxLength={2}
      keyboardType="number-pad"
      onChange={(value) => {
        const numreg = /^[0-9]+$/;

        const hour = numreg.test(Kit.numbersToEnglish(value)) && parseInt(value) <= 23 ? value : '';

        if (from) {
          onUpdate({ ...rt, from: { hour: hour, minute: rt.from.minute } });
        } else {
          onUpdate({ ...rt, to: { hour: hour, minute: rt.to.minute } });
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  enable: {
    width: wp(92),
    borderColor: '#38488A',
    borderWidth: 1,
    borderRadius: hp(1.2),
    marginTop: hp(2),
  },
  disable: {
    width: wp(92),
    height: hp(6.5),
    borderColor: '#38488A',
    borderWidth: 1,
    borderRadius: hp(1.2),
    paddingHorizontal: wp(14),
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: hp(2),
    backgroundColor: '#f2f2f2',
  } as ViewProps,
  timeText: {
    fontFamily: R.fonts.fontFamily_faNum,
    fontSize: wp(3.3),
    textAlign: 'center',
    color: '#38488A',
    maxWidth: 100,
  },
});
export default memo(DoctorWorkTimeSettingScreen);
