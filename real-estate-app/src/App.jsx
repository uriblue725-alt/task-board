import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import PropertyListPage from './pages/PropertyListPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <PropertyListPage />
              </ProtectedRoute>
            }
          />
          {/* それ以外のURLは物件一覧へ（未ログインならそこからログイン画面へ転送される） */}
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
