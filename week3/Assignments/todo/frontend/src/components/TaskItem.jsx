import React, { useState } from 'react';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onUpdate(task._id, { title: title.trim(), description: description.trim() });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setEditing(false);
  };

  if (editing) {
    return (
      <li className="task-item">
        <button className={`checkbox-btn ${task.completed ? 'checked' : ''}`} disabled>
          <CheckIcon />
        </button>
        <div className="edit-row">
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="task-item">
      <button
        className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
        aria-label={task.completed ? 'Mark as not done' : 'Mark as done'}
      >
        <CheckIcon />
      </button>
      <div className="task-content">
        <p className={`task-title ${task.completed ? 'done' : ''}`}>{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Edit task">
          <PencilIcon />
        </button>
        <button className="icon-btn delete" onClick={() => onDelete(task._id)} aria-label="Delete task">
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
