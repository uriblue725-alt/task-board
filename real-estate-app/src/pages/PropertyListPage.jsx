import { useEffect, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import PropertyForm from '../components/PropertyForm'
import { useAuth } from '../contexts/AuthContext'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'
import './PropertyListPage.css'

// テーブルが未作成のときにSupabaseが返すエラーコード
const TABLE_NOT_FOUND_CODE = 'PGRST205'

function PropertyListPage() {
  const { session, signOut } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  // 画面上部に表示するエラー（取得・削除・ログアウトの失敗）
  const [errorMessage, setErrorMessage] = useState('')
  // 新規登録フォームを表示中か
  const [isCreating, setIsCreating] = useState(false)
  // 編集フォームを表示中の物件のID（なければ null）
  const [editingId, setEditingId] = useState(null)

  // 最初に物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((error) => {
        setLoadFailed(true)
        setErrorMessage(
          error.code === TABLE_NOT_FOUND_CODE
            ? 'properties テーブルがありません。supabase/schema.sql をSupabaseのSQL Editorで実行してください。'
            : `物件の取得に失敗しました: ${error.message}`,
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const handleStartCreate = () => {
    setEditingId(null)
    setIsCreating(true)
  }

  const handleStartEdit = (id) => {
    setIsCreating(false)
    setEditingId(id)
  }

  // フォームから呼ばれる。失敗時は例外がフォームに伝わり、フォーム内にエラーが表示される
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
    setIsCreating(false)
  }

  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setErrorMessage('')
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (error) {
      setErrorMessage(`削除に失敗しました: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    setErrorMessage('')
    const { error } = await signOut()
    // 成功するとセッションが空になり、ProtectedRoute がログイン画面へ転送する
    if (error) setErrorMessage('ログアウトに失敗しました。もう一度お試しください。')
  }

  return (
    <div className="property-list-page">
      <header className="property-list-header">
        <h1 className="property-list-title">物件一覧</h1>
        <div className="property-list-user">
          <span className="user-email">{session.user.email}</span>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>
      </header>

      {errorMessage && (
        <p className="page-error" role="alert">
          {errorMessage}
        </p>
      )}

      {isCreating ? (
        <div className="property-create-panel">
          <PropertyForm
            submitLabel="登録する"
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          className="create-button"
          onClick={handleStartCreate}
        >
          ＋ 物件を登録
        </button>
      )}

      {loading && <p className="loading-message">読み込み中...</p>}

      {!loading && !loadFailed && !isCreating && properties.length === 0 && (
        <p className="empty-message">
          物件がまだ登録されていません。「物件を登録」から追加してください。
        </p>
      )}

      <ul className="property-list">
        {properties.map((property) => (
          <li key={property.id}>
            {editingId === property.id ? (
              <PropertyForm
                initialValues={property}
                submitLabel="保存する"
                onSubmit={(values) => handleUpdate(property.id, values)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <PropertyCard
                property={property}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PropertyListPage
