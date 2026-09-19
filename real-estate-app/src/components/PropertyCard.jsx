import './PropertyCard.css'

// 物件1件分のカード（物件名・家賃・エリア・間取りと、編集・削除ボタンを表示する）
function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <article className="property-card">
      <h2 className="property-name">{property.name}</h2>
      <dl className="property-details">
        <dt>家賃</dt>
        <dd className="property-rent">{property.rent.toLocaleString()}円 / 月</dd>
        <dt>エリア</dt>
        <dd>{property.area}</dd>
        <dt>間取り</dt>
        <dd>{property.floorPlan}</dd>
      </dl>
      <div className="property-actions">
        <button
          type="button"
          className="property-edit-button"
          onClick={() => onEdit(property.id)}
        >
          編集
        </button>
        <button
          type="button"
          className="property-delete-button"
          onClick={() => onDelete(property)}
        >
          削除
        </button>
      </div>
    </article>
  )
}

export default PropertyCard
