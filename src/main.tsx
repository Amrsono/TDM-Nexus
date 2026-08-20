import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AIAssistantProvider } from './context/AIAssistantContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AIAssistantProvider>
        <App />
      </AIAssistantProvider>
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
);
