import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AIAssistantProvider } from './context/AIAssistantContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AIAssistantProvider>
      <App />
    </AIAssistantProvider>
  </StrictMode>,
)
