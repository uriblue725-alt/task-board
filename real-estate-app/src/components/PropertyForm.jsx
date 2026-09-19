import { useState } from 'react'
import './PropertyForm.css'

// 物件の新規登録・編集で共通のフォーム
// 編集時は initialValues に既存の値を渡す。onSubmit(values) は保存に失敗したら例外を投げる
function PropertyForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(String(initialValues?.rent ?? ''))
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [floorPlan, setFloorPlan] = useState(initialValues?.floorPlan ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const values = {
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      floorPlan: floorPlan.trim(),
    }
    // required では空白だけの入力を防げないため、トリム後にも確認する
    if (!values.name || !values.area || !values.floorPlan) {
      setErrorMessage('未入力の項目があります。')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      setErrorMessage(`保存に失敗しました: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label className="property-form-field">
        物件名
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="property-form-field">
        家賃（円）
        <input
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          min="0"
          step="1"
          required
        />
      </label>

      <label className="property-form-field">
        エリア
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="例：東京都渋谷区"
          required
        />
      </label>

      <label className="property-form-field">
        間取り
        <input
          type="text"
          value={floorPlan}
          onChange={(e) => setFloorPlan(e.target.value)}
          placeholder="例：1LDK"
          required
        />
      </label>

      {errorMessage && (
        <p className="property-form-error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="property-form-actions">
        <button
          type="submit"
          className="property-form-submit"
          disabled={submitting}
        >
          {submitting ? '保存中...' : submitLabel}
        </button>
        <button
          type="button"
          className="property-form-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

export default PropertyForm
