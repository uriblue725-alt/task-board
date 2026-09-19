import { useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'
import './PropertyListPage.css'

function PropertyListPage() {
  const { session, signOut } = useAuth()
  const [logoutError, setLogoutError] = useState('')

  const handleLogout = async () => {
    setLogoutError('')
    const { error } = await signOut()
    // 成功するとセッションが空になり、ProtectedRoute がログイン画面へ転送する
    if (error) setLogoutError('ログアウトに失敗しました。もう一度お試しください。')
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

      {logoutError && (
        <p className="logout-error" role="alert">
          {logoutError}
        </p>
      )}

      <ul className="property-list">
        {properties.map((property) => (
          <li key={property.id}>
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PropertyListPage
