import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { getAll, remove } from '../storage/outbox';
import { setCache } from '../storage/cache';
import { CACHE_STUDENT } from '../storage/keys';
import { request } from '../api/client';
import useNetworkStatus from './useNetworkStatus';

export default function useOutboxSync(onSynced) {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const prevOnline = useRef(isOnline);

  const refreshPending = useCallback(async () => {
    const list = await getAll();
    setPendingCount(list.length);
    return list;
  }, []);

  const syncNow = useCallback(async () => {
    if (syncing) {
      return;
    }
    const list = await getAll();
    if (!list || list.length === 0) {
      setPendingCount(0);
      return;
    }

    setSyncing(true);
    let synced = 0;
    let hasConflict = false;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      try {
        if (item.method === 'PATCH' && item.url.includes('/students')) {
          let serverData = null;
          try {
            serverData = await request('GET', item.url);
          } catch (e) {}

          const offlineTime = new Date(item.body?.updatedAt || item.createdAt).getTime();
          const serverTime = serverData?.updatedAt ? new Date(serverData.updatedAt).getTime() : 0;

          if (serverTime > offlineTime) {
            Alert.alert(
              'Xung đột cập nhật',
              'Dữ liệu sinh viên trên máy chủ mới hơn thao tác offline của bạn. Ưu tiên giữ dữ liệu máy chủ.'
            );
            await remove(item.id);
            if (serverData) {
              await setCache(CACHE_STUDENT, serverData);
            }
            hasConflict = true;
            continue;
          }

          const res = await request(item.method, item.url, item.body);
          console.log(res);
          await remove(item.id);
          synced++;
        } else {
          const res = await request(item.method, item.url, item.body);
          console.log(res);
          await remove(item.id);
          synced++;
        }
      } catch (err) {
        break;
      }
    }

    const remaining = await getAll();
    setPendingCount(remaining.length);
    setSyncing(false);

    if (synced > 0) {
      Alert.alert('Đồng bộ thành công', `Đã đồng bộ ${synced} thay đổi`);
    }

    if (onSynced && (synced > 0 || hasConflict)) {
      onSynced();
    }
  }, [syncing, onSynced]);

  useEffect(() => {
    refreshPending();
  }, [refreshPending]);

  useEffect(() => {
    if (!prevOnline.current && isOnline) {
      syncNow();
    }
    prevOnline.current = isOnline;
  }, [isOnline, syncNow]);

  return {
    pendingCount,
    syncing,
    syncNow,
    refreshPending,
  };
}
