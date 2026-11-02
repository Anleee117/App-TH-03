import { useState, useEffect, useCallback } from 'react';
import { getCache, setCache } from '../storage/cache';

export default function useCachedQuery(key, fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      const cached = await getCache(key);
      if (cached && cached.data !== undefined) {
        setData(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
      }
    }

    try {
      const res = await fetcher();
      setData(res);
      const saved = await setCache(key, res);
      if (saved) {
        setLastUpdated(saved.savedAt);
      }
      setError(null);
    } catch (err) {
      const cached = await getCache(key);
      if (!cached || cached.data === undefined) {
        setError(err.message || 'Lỗi tải dữ liệu');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [key, fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    return load(true);
  }, [load]);

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
    setData,
  };
}
