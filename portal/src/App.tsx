import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Billing from './pages/Billing'
import Blueprint from './pages/Blueprint'
import Circle from './pages/Circle'
import Home from './pages/Home'
import Sessions from './pages/Sessions'
import AcceptInvite from './pages/auth/AcceptInvite'
import ForgotPassword from './pages/auth/ForgotPassword'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import AuthProvider from './state/AuthProvider'
import NextStepsProvider from './state/NextStepsProvider'

// Only staff need this, so clients don't download it.
const StaffApp = lazy(() => import('./staff/StaffApp'))

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="staff/*"
          element={
            <Suspense fallback={<p className="auth-splash muted">Loading…</p>}>
              <StaffApp />
            </Suspense>
          }
        />
        <Route path="*" element={<ClientApp />} />
      </Routes>
    </BrowserRouter>
  )
}

function ClientApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="invite/:token" element={<AcceptInvite />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <NextStepsProvider>
                <Layout />
              </NextStepsProvider>
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route path="blueprint/:facetId?" element={<Blueprint />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="billing" element={<Billing />} />
          <Route path="circle" element={<Circle />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
