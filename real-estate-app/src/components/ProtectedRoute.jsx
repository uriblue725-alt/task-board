import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログイン済みのユーザーにだけ children を表示し、未ログインならログイン画面へ転送する
function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="loading-message">読み込み中...</p>
  if (!session) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
