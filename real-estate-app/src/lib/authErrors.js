// Supabase Auth のエラーメッセージ（英語）を画面表示用の日本語に変換する
const errorMessages = {
  'Invalid login credentials': 'メールアドレスまたはパスワードが正しくありません。',
  'User already registered': 'このメールアドレスは既に登録されています。',
  'Email not confirmed':
    'メールアドレスの確認が完了していません。届いたメールのリンクをクリックしてください。',
}

export function translateAuthError(error) {
  if (errorMessages[error.message]) return errorMessages[error.message]
  if (error.message.startsWith('Password should be at least')) {
    return 'パスワードは6文字以上で入力してください。'
  }
  // 未対応のエラーは原文を添えて表示する
  return `エラーが発生しました: ${error.message}`
}
