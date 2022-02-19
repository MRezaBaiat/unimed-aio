import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

interface Props<T> extends FlatListProps<T> {
  data: T[];
}
function AppListView(props: Props<any>) {
  return <FlatList {...props} />;
}
export default React.memo(AppListView);
