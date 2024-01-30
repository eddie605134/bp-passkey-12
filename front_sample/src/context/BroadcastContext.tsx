// BroadcastContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export interface BroadcastContextType<T> {
  data: T | null;
  postData: (value: T) => void;
}

const BroadcastContext = createContext<BroadcastContextType<any>>({
  data: null,
  postData: () => {},
});

export function BroadcastProvider<T>({ children, channelName, key }: { children: React.ReactNode, channelName: string, key: string }) {
  const [data, setData] = useState<T | null>(null);
  const [channel] = useState(new BroadcastChannel(channelName));

  useEffect(() => {
    const handleStorageUpdate = (message: MessageEvent<{ key: string; value: T }>) => {
      if (message.data.key === key) {
        setData(message.data.value);
      }
    };

    channel.addEventListener('message', handleStorageUpdate);

    return () => {
      channel.removeEventListener('message', handleStorageUpdate);
      channel.close();
    };
  }, [channel, key]);

  const postData = useCallback((value: T) => {
    channel.postMessage({ key, value });
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [channel, key]);

  return (
    <BroadcastContext.Provider value={{ data, postData }}>
      {children}
    </BroadcastContext.Provider>
  );
}

export default BroadcastContext;
