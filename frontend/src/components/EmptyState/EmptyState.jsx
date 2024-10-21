import "./EmptyState.css";

const EmptyState = () => {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">No Posts Available</h2>
      <p className="empty-state__message">
        It seems there are no posts here yet. Be the first to create a new post!
      </p>
    </div>
  );
};

export default EmptyState;
