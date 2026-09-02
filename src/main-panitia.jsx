import React from 'react'
import ReactDOM from 'react-dom/client'
import PanitiaApp from './panitia.jsx'
import './index.css'

const rootElement = document.getElementById('app') || document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <PanitiaApp />
    </React.StrictMode>,
  )
} else {
  console.error("Error: Tidak menemukan elemen ID 'app' atau 'root' di panitia.html");
}
