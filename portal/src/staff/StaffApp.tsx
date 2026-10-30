import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import RequireAuth from '../components/RequireAuth'
import AcceptInvite from '../pages/auth/AcceptInvite'
import ForgotPassword from '../pages/auth/ForgotPassword'
import Login from '../pages/auth/Login'
import ResetPassword from '../pages/auth/ResetPassword'
import AuthProvider from '../state/AuthProvider'
import { RealmContext, STAFF_REALM } from '../state/realm'
import StaffLayout from './StaffLayout'
import BlueprintEditor from './pages/BlueprintEditor'
import Blueprints from './pages/Blueprints'
import CallDetail from './pages/CallDetail'
import Circle from './pages/Circle'
import ClientDetail from './pages/ClientDetail'
import Clients from './pages/Clients'
import Facets from './pages/Facets'
import Inquiries from './pages/Inquiries'
import Overview from './pages/Overview'

/** The staff portal at /staff: Kadi's side. Shares the sign-in pages with clients, with its own session. */
export default function StaffApp() {
  return (
    <RealmContext.Provider value={STAFF_REALM}>
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
                <StaffLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Overview />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetail />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="blueprints" element={<Blueprints />} />
            <Route path="blueprints/facets" element={<Facets />} />
            <Route path="blueprints/:blueprintId" element={<BlueprintEditor />} />
            <Route path="circle" element={<Circle />} />
            <Route path="circle/calls/:callId" element={<CallDetail />} />
            <Route path="*" element={<Navigate to="/staff" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </RealmContext.Provider>
  )
}
