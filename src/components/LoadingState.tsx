export function LoadingState() {
  return (
    <section className="loading-state" aria-live="polite" aria-busy="true">
      <span className="spinner" aria-hidden="true" />
      <h1>Loading the collection</h1>
      <p>Getting the posters ready.</p>
    </section>
  );
}
