import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreProvider } from '../hooks/useStore';
import { rootStore } from '../stores/rootStore';
import { Spinner } from '../components/common/Spinner';

interface ProvidersProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  // Remove automatic session check to prevent continuous refreshing
  // Users will be redirected to login if not authenticated when they try to access protected routes
  
  return <>{children}</>;
});

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <StoreProvider value={rootStore}>
      <AppInitializer>
        {children}
      </AppInitializer>
    </StoreProvider>
  );
};