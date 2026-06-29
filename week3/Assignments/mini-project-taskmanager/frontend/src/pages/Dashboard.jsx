import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';

const STATUS_COLUMNS = [
  { key: 'todo', label: 'To do', dotClass: 'todo' },
  { key: 'in-progress', label: 'In progress', dotClass: 'progress' },
  { key: 'done', label: 'Done', dotClass: 'done' },
];

const PRIORITY_FILTERS = ['all', 'high', 'medium', 'low'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const [tasksRes, statsRes] = await Promise.all([
        api.get('/tasks', { params }),
        api.get('/tasks/stats'),
      ]);
      setTasks(tasksRes.data.tasks);
      setStats(statsRes.data);
      setError('');
    } catch (err) {
      setError('Could not load your tasks.');
    } finally {
      setLoading(false);
    }
  }, [priorityFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce search slightly so we don't fire a request per keystroke
  useEffect(() => {
    const handle = setTimeout(fetchData, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCreate = async (payload) => {
    const { data } = await api.post('/tasks', payload);
    setTasks((prev) => [data, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1, todo: prev.todo + 1 }));
  };

  const handleUpdate = async (payload) => {
    const { data } = await api.put(`/tasks/${editingTask._id}`, payload);
    setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    setEditingTask(null);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      // refresh stats lightly
      const statsRes = await api.get('/tasks/stats');
      setStats(statsRes.data);
    } catch (err) {
      setError('Could not update that task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      const statsRes = await api.get('/tasks/stats');
      setStats(statsRes.data);
    } catch (err) {
      setError('Could not delete that task.');
    }
  };

  const tasksByStatus = (statusKey) => tasks.filter((t) => t.status === statusKey);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Pace</h1>
        <div className="header-right">
          <span className="user-chip">{user?.name}</span>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total tasks</div>
        </div>
        <div className="stat-card todo">
          <div className="stat-value">{stats.todo}</div>
          <div className="stat-label">To do</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In progress</div>
        </div>
        <div className="stat-card done">
          <div className="stat-value">{stats.done}</div>
          <div className="stat-label">Done</div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm
        editingTask={editingTask}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        onCancelEdit={() => setEditingTask(null)}
      />

      <div className="filters-row">
        <div className="filter-group">
          {PRIORITY_FILTERS.map((p) => (
            <button
              key={p}
              className={`filter-chip ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => setPriorityFilter(p)}
            >
              {p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading your board…</div>
      ) : (
        <div className="board">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = tasksByStatus(col.key);
            return (
              <div className="board-column" key={col.key}>
                <div className="board-column-header">
                  <span className={`status-dot ${col.dotClass}`} />
                  {col.label}
                  <span className="column-count">{colTasks.length}</span>
                </div>
                {colTasks.length === 0 ? (
                  <div className="column-empty">Nothing here</div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      onEdit={setEditingTask}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
