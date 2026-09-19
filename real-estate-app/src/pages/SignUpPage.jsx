import { Link, Navigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../contexts/AuthContext'
import { translateAuthError } from '../lib/authErrors'

function SignUpPage() {
  const { session, loading, signUp } = useAuth()

  if (loading) return <p className="loading-message">読み込み中...</p>

  // ログイン済みなら物件一覧へ（メール確認が不要な設定なら登録直後もここで遷移する）
  if (session) return <Navigate to="/properties" replace />

  const handleSignUp = async (email, password) => {
    const { data, error } = await signUp(email, password)
    if (error) return { error: translateAuthError(error) }

    // メール確認が有効な設定ではセッションが返らないため、確認メールの案内を表示する
    if (!data.session) {
      return {
        info: '確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。',
      }
    }
  }

  return (
    <AuthForm
      title="会員登録"
      submitLabel="登録する"
      passwordAutoComplete="new-password"
      onSubmit={handleSignUp}
      footer={
        <>
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </>
      }
    />
  )
}

export default SignUpPage
