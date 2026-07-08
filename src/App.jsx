import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </ErrorBoundary>
  );
}
