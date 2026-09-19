import { Link, Navigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../contexts/AuthContext'
import { translateAuthError } from '../lib/authErrors'

function LoginPage() {
  const { session, loading, signIn } = useAuth()

  if (loading) return <p className="loading-message">読み込み中...</p>

  // ログイン済みなら物件一覧へ（ログインに成功した直後もここで遷移する）
  if (session) return <Navigate to="/properties" replace />

  const handleSignIn = async (email, password) => {
    const { error } = await signIn(email, password)
    if (error) return { error: translateAuthError(error) }
  }

  return (
    <AuthForm
      title="ログイン"
      submitLabel="ログイン"
      passwordAutoComplete="current-password"
      onSubmit={handleSignIn}
      footer={
        <>
          アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
        </>
      }
    />
  )
}

export default LoginPage
