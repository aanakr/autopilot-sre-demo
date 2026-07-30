import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AutopilotProvider } from './context/AutopilotContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AutopilotProvider>
      <App />
    </AutopilotProvider>
  </React.StrictMode>,
)
