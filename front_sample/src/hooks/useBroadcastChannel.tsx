import { useContext } from 'react';
import BroadcastContext from '../context/BroadcastContext';

import type { BroadcastContextType } from '../context/BroadcastContext';

function useBroadcastChannel<T>() {
  const context = useContext<BroadcastContextType<T>>(BroadcastContext);
  return context;
}

export default useBroadcastChannel;