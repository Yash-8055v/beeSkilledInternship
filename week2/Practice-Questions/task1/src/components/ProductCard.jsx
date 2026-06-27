function ProductCard({ image, name, price, description }) {
  return (
    <div className="card">
      <img src={image} alt={name} />

      <h2>{name}</h2>

      <p>{description}</p>

      <h3>₹ {price}</h3>

      <button>Buy Now</button>
    </div>
  );
}

export default ProductCard;