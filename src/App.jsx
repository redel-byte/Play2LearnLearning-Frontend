import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SplashCursor from './components/SplashCursor'
import ErrorFallback from './components/ErrorFallback'
import PublicRouter from './routes/PublicRouter'
import PrivateRoutes from './routes/PrivateRoute'
import AuthRoutes from './routes/AuthRoutes'
import { RulesProvider } from './context/RulesContext'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { fetchAuthenticatedUser } from './api/auth'
import { getAuthToken } from './api/userManagment'
function App() {
  useEffect(() => {
    if (!getAuthToken()) {
      return
    }

    fetchAuthenticatedUser().catch(() => {})
  }, [])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RulesProvider>
        <BrowserRouter>
          <SplashCursor
            SIM_RESOLUTION={64}
            DYE_RESOLUTION={512}
            DENSITY_DISSIPATION={2.0}
            VELOCITY_DISSIPATION={0.98}
            PRESSURE={0.8}
            CURL={30}
            SPLAT_RADIUS={0.25}
            SPLAT_FORCE={3000}
            COLOR_UPDATE_SPEED={5}
            SHADING={false}
          />
          <Routes>
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route path="/private/*" element={<PrivateRoutes />} />
            <Route path="/*" element={<PublicRouter />} />
          </Routes>
        </BrowserRouter>
      </RulesProvider>
    </ErrorBoundary>
  )
}

export default App
