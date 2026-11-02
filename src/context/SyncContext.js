import React, { createContext, useContext } from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import useOutboxSync from '../hooks/useOutboxSync';

const SyncContext = createContext(null);

export function SyncProvider({ children, onSynced }) {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, syncing, syncNow, refreshPending } = useOutboxSync(onSynced);

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        syncing,
        syncNow,
        refreshPending,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    return {
      isOnline: true,
      pendingCount: 0,
      syncing: false,
      syncNow: () => {},
      refreshPending: () => {},
    };
  }
  return context;
}
