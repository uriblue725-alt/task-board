import { useState } from 'react'
import './AuthForm.css'

// ログイン・会員登録で共通のメールアドレス＋パスワードフォーム
// onSubmit(email, password) は、失敗時に { error }、案内表示なら { info } を返す（成功時は何も返さない）
function AuthForm({
  title,
  submitLabel,
  passwordAutoComplete,
  onSubmit,
  footer,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setSubmitting(true)

    const result = await onSubmit(email, password)

    setSubmitting(false)
    if (result?.error) setErrorMessage(result.error)
    if (result?.info) setInfoMessage(result.info)
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">{title}</h1>

        <label className="auth-field">
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-field">
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={passwordAutoComplete}
            minLength={6}
            required
          />
        </label>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}
        {infoMessage && <p className="auth-info">{infoMessage}</p>}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? '送信中...' : submitLabel}
        </button>

        <p className="auth-footer">{footer}</p>
      </form>
    </div>
  )
}

export default AuthForm
