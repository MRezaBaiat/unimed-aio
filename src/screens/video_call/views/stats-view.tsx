import React, { useEffect, useState } from 'react';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import StreamStats from '../v3/StreamStats';
import P2PRoom from '../v3/P2PRoom';

interface Props {
  connection: P2PRoom;
}
function StatsView(props: Props) {
  const { connection } = props;
  const [streamStats, setStreamStats] = useState(undefined as StreamStats | undefined);
  useEffect(() => {
    if (connection) {
      console.log('rendering');
      /* connection.getStats(2000, (stats) => {
        console.log('rendering', stats);
        setStreamStats(stats);
      }); */
    }
    return () => {
      streamStats && streamStats.stop();
    };
  }, [connection]);

  return <AppTextView textColor={'white'} textAlign={'left'} fontSize={12} style={{ position: 'absolute', top: 150, left: 0, backgroundColor: 'black', zIndex: 2 }} text={streamStats ? streamStats.getReports() : ''} />;
}

export default React.memo(StatsView);
