import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import './custom.css';

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.9rem',
            },
          }}
        />
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={<ErrorBoundary>{element}</ErrorBoundary>} />;
          })}
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}
