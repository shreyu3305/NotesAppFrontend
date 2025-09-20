import { useContext, createContext } from 'react';
import { rootStore, RootStore } from '../stores/rootStore';

const StoreContext = createContext<RootStore>(rootStore);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};

export const StoreProvider = StoreContext.Provider;