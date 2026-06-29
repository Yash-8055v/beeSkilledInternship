import React, { useEffect, useState, useMemo } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import TaskItem from '../components/TaskItem.jsx';

const FILTERS = ['All', 'Active', 'Done'];

export default function Tasks() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);

  const today = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
    []
  );

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Could not load your tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post('/tasks', {
        title: newTitle.trim(),
        description: newDesc.trim(),
      });
      setTasks((prev) => [data, ...prev]);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      setError('Could not add that task.');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data : t)));
    } catch (err) {
      setError('Could not update that task.');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      setError('Could not save your changes.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError('Could not delete that task.');
    }
  };

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Done') return t.completed;
    return true;
  });

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">
          Tasked<span className="dot">.</span>
        </h1>
        <div className="header-meta">
          <span className="user-chip">{user?.name}</span>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <p className="date-line">
        {today} — {remaining} task{remaining === 1 ? '' : 's'} left
      </p>

      {error && <div className="error-banner">{error}</div>}

      <form className="add-task-form" onSubmit={handleAdd}>
        <div className="add-task-row">
          <input
            type="text"
            placeholder="What needs doing?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="add-btn" type="submit" disabled={adding || !newTitle.trim()}>
            Add
          </button>
        </div>
        <input
          className="desc-input"
          type="text"
          placeholder="Add a description (optional)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
      </form>

      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading your tasks…</div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">
            {filter === 'Done' ? 'Nothing finished yet' : filter === 'Active' ? "You're all caught up" : 'A blank page'}
          </p>
          <p>{filter === 'All' ? 'Add your first task above to get started.' : 'Switch filters to see other tasks.'}</p>
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
