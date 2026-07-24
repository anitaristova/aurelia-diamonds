export default function LoginRequiredModal({ onCancel, onGoToLogin }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="login-required-title">
      <div className="modal">
        <h2 id="login-required-title" className="modal__title">
          Please log in
        </h2>
        <p className="modal__body">
          You need to be logged in to add products to your Favorites or Cart.
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--primary" onClick={onGoToLogin}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
