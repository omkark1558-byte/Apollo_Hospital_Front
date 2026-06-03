function Card({ title, value, tone = "blue", helper }) {
  return (
    <article className={`stat-card ${tone}`}>
      <div className="stat-top">
        <h3>{title}</h3>
        <span className="stat-indicator" />
      </div>
      <strong>{value}</strong>
      {helper && <p>{helper}</p>}
    </article>
  );
}

export default Card;
