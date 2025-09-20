import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreProvider } from '../hooks/useStore';
import { rootStore } from '../stores/rootStore';
import { Spinner } from '../components/common/Spinner';

interface ProvidersProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const { auth } = rootStore;

  useEffect(() => {
    auth.checkSession();
  }, [auth]);

  // Show loading during initial session check
  if (auth.status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="h-8 w-8 mb-4 mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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