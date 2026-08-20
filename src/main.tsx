import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ProjectProvider } from './context/ProjectContext';
import { AIAssistantProvider } from './context/AIAssistantContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProjectProvider>
        <AIAssistantProvider>
          <App />
        </AIAssistantProvider>
      </ProjectProvider>
      <Analytics />
    </ErrorBoundary>
  </StrictMode>,
);
