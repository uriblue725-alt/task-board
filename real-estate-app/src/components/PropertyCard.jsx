import './PropertyCard.css'

// 物件1件分のカード（物件名・家賃・エリアを表示する）
function PropertyCard({ property }) {
  return (
    <article className="property-card">
      <h2 className="property-name">{property.name}</h2>
      <dl className="property-details">
        <dt>家賃</dt>
        <dd className="property-rent">{property.rent.toLocaleString()}円 / 月</dd>
        <dt>エリア</dt>
        <dd>{property.area}</dd>
      </dl>
    </article>
  )
}

export default PropertyCard
