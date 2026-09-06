import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import './index.css'
import AppShell from './components/AppShell'
import Splash from './screens/Splash'
import Dashboard from './screens/Dashboard'
import NewBooking from './screens/NewBooking'
import JobDetails from './screens/JobDetails'
import Workers from './screens/Workers'
import WorkerDashboard from './screens/WorkerDashboard'
import WorkerMode from './screens/WorkerMode'
import TrackJob from './screens/TrackJob'
import Inventory from './screens/Inventory'
import Customers from './screens/Customers'
import CustomerHistory from './screens/CustomerHistory'
import WhatsAppAutomation from './screens/WhatsAppAutomation'
import Analytics from './screens/Analytics'
import Gallery from './screens/Gallery'
import Settings from './screens/Settings'
import Styleguide from './screens/Styleguide'

const router = createBrowserRouter([
  // Cinematic branded entry
  { path: '/splash', element: <Splash /> },
  // Worker journey is full-screen and glove-friendly: no bottom nav.
  // Worker lands on their own dashboard (from WhatsApp link), then opens a job.
  { path: '/worker/:id', element: <WorkerDashboard /> },
  { path: '/worker/:id/job/:jobId', element: <WorkerMode /> },
  // Public customer tracking link (from WhatsApp) — no nav, no login
  { path: '/track/:jobId', element: <TrackJob /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'bookings', element: <NewBooking /> },
      { path: 'workers', element: <Workers /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'profile', element: <Settings /> },
      { path: 'customers', element: <Customers /> },
      { path: 'customer/:id', element: <CustomerHistory /> },
      { path: 'whatsapp', element: <WhatsAppAutomation /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'job/:id', element: <JobDetails /> },
      { path: 'styleguide', element: <Styleguide /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
