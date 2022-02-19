import { CommonActions, NavigationContainerRef } from '@react-navigation/native';

export let _navigator: NavigationContainerRef;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}
function getTopScreen(): string | undefined {
  const route = _navigator && _navigator.getCurrentRoute();
  return route && route.name;
}

function navigateTo(routeName, params?) {
  if (getTopScreen() === routeName) {
    return;
  }
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    })
  );
}

function resetStackTo(screenName: string, params?) {
  if (getTopScreen() === screenName) {
    return;
  }
  _navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: screenName,
          params,
        },
      ],
    })
  );
}

function goBack() {
  _navigator.dispatch(CommonActions.goBack());
}

export const getScreenParam = <T>(screenProps: object, param?: string) => {
  console.log(screenProps);
  if (param) {
    return screenProps.route.params && screenProps.route.params[param];
  } else {
    return screenProps.route.params || {};
  }
};

// add other navigation functions that you need and export them

export default {
  navigateTo,
  goBack,
  setTopLevelNavigator,
  getTopScreen,
  resetStackTo,
};
