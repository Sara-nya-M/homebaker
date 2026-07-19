import React from 'react';
import './EmptyState.css';

function EmptyState({
  icon = '🧁',
  title = 'No Items Found',
  description = 'There are no items to display at the moment.',
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-wrapper">
        <span className="empty-state-icon">{icon}</span>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary empty-state-action">
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
