type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">
        !
      </span>
      <h1>The collection is unavailable</h1>
      <p>{message}</p>
      <button className="primary-button" type="button" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}
