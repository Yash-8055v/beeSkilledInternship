import React, { useState, useEffect } from 'react';

const emptyForm = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskForm({ editingTask, onSubmit, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        dueDate: form.dueDate || null,
      });
      if (!editingTask) setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-task-card" onSubmit={handleSubmit}>
      <div className="add-task-row1">
        <input
          type="text"
          placeholder={editingTask ? 'Edit task title' : 'What needs to get done?'}
          value={form.title}
          onChange={handleChange('title')}
        />
        <button className="add-btn" type="submit" disabled={submitting || !form.title.trim()}>
          {editingTask ? 'Save' : 'Add task'}
        </button>
        {editingTask && (
          <button type="button" className="logout-btn" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
      <div className="add-task-row2">
        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange('description')}
          style={{ flex: 1, minWidth: '180px' }}
        />
        <select value={form.priority} onChange={handleChange('priority')}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" value={form.dueDate} onChange={handleChange('dueDate')} />
      </div>
    </form>
  );
}
