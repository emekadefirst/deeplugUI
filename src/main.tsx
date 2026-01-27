import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import LandingPage from './pages/LandingPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { DashboardLayout } from './pages/dashboard/DashboardLayout'
import { DashboardHome } from './pages/dashboard/DashboardHome'
import { OrdersPage } from './pages/dashboard/OrdersPage'
import { WalletPage } from './pages/dashboard/WalletPage'
import { TransactionsPage } from './pages/dashboard/TransactionsPage'
import { PaymentsPage } from './pages/dashboard/PaymentsPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
import { VerifyAccountPage } from './pages/dashboard/services/VerifyAccountPage'
import { VirtualSimPage } from './pages/dashboard/services/VirtualSimPage'
import { VSimCommunicationsPage } from './pages/dashboard/services/VSimCommunicationsPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { ToastContainer } from './components/ui/ToastContainer'
import { CookieConsent } from './components/CookieConsent'

// Register Service Worker
registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="services/verify" element={<VerifyAccountPage />} />
          <Route path="services/virtual-sim" element={<VirtualSimPage />} />
          <Route path="services/virtual-sim/communications" element={<VSimCommunicationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer />
    <CookieConsent />
  </StrictMode>,
)
