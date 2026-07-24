export default function Placeholder({ title, message }) {
  return (
    <div className="container placeholder">
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__message">
        {message || 'This section is coming soon.'}
      </p>
    </div>
  );
}
