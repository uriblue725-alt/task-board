import { createClient } from '@supabase/supabase-js'

// .env から接続情報を読み込む（Viteでは VITE_ プレフィックスが必要）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 設定漏れにすぐ気づけるよう、未設定なら分かりやすいエラーにする
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabaseの接続情報が未設定です。.env に VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください。',
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
