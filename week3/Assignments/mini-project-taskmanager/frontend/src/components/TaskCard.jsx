import React from 'react';

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

const formatDue = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
  return (
    <div className={`task-card priority-${task.priority}`}>
      <p className="task-card-title">{task.title}</p>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-meta">
        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
        {task.dueDate && <span className="due-date">Due {formatDue(task.dueDate)}</span>}
      </div>
      <div className="task-card-actions">
        <select
          className="task-status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">
          <PencilIcon />
        </button>
        <button className="icon-btn delete" onClick={() => onDelete(task._id)} aria-label="Delete task">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
