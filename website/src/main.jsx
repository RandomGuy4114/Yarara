import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import Docs from './pages/Docs.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/docs/:slug?" element={<Docs />} />
    </Routes>
  </BrowserRouter>,
)
