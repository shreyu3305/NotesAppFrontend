import { createBrowserRouter, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../stores/rootStore';
import { AppLayout } from './layout/AppLayout';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { NotesList } from '../pages/NotesList';
import { NoteDetail } from '../pages/NoteDetail';
import { NoteCreate } from '../pages/NoteCreate';

// Route guards
const PrivateRoute = observer(({ children }: { children: React.ReactNode }) => {
  const { auth } = rootStore;
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
});

const PublicRoute = observer(({ children }: { children: React.ReactNode }) => {
  const { auth } = rootStore;
  
  if (auth.isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }
  
  return <>{children}</>;
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/notes" replace />,
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: '/notes',
        element: (
          <PrivateRoute>
            <NotesList />
          </PrivateRoute>
        ),
      },
      {
        path: '/notes/new',
        element: (
          <PrivateRoute>
            <NoteCreate />
          </PrivateRoute>
        ),
      },
      {
        path: '/notes/:id',
        element: (
          <PrivateRoute>
            <NoteDetail />
          </PrivateRoute>
        ),
      },
    ],
  },
]);