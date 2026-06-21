function BlogCard({
  title,
  category,
  description
}) {
  return (
    <div className="card">

      <span className="badge">
        {category}
      </span>

      <h2>{title}</h2>

      <p>{description}</p>

    </div>
  );
}

export default BlogCard;