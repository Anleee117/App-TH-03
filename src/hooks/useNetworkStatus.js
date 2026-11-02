import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let unsub = null;
    try {
      if (NetInfo && NetInfo.addEventListener) {
        unsub = NetInfo.addEventListener(state => {
          const online = Boolean(state.isConnected && state.isInternetReachable !== false);
          setIsOnline(online);
        });
        NetInfo.fetch()
          .then(state => {
            const online = Boolean(state.isConnected && state.isInternetReachable !== false);
            setIsOnline(online);
          })
          .catch(() => {});
      }
    } catch (err) {
      setIsOnline(true);
    }

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);

  return { isOnline };
}
