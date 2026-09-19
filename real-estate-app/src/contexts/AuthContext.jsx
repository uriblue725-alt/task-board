import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

// アプリ全体にログイン状態（session）と認証操作を提供する
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 最初のセッション取得が終わるまで true（取得前に未ログイン扱いでリダイレクトしないため）
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ページを開いた時点で保存済みのセッションがあれば復元する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウト・トークン更新のたびに呼ばれる
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    session,
    loading,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使用してください')
  }
  return context
}
