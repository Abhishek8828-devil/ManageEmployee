import React, { useState, useEffect } from 'react';

function TaskList({ token, userRole, username }) {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = React.useCallback(async () => {
    setError('');
    try {
      let url = 'http://localhost:5000/api/tasks?';
      if (statusFilter) url += `status=${encodeURIComponent(statusFilter)}&`;
      if (assigneeFilter) url += `assignedTo=${encodeURIComponent(assigneeFilter)}&`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch {
      setError('Server error');
    }
  }, [statusFilter, assigneeFilter, token]);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, assigneeFilter, fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      } else {
        setError(data.message || 'Failed to delete task');
      }
    } catch {
      setError('Server error');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === task._id ? data : t))
        );
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch {
      setError('Server error');
    }
  };

  const canDelete = userRole === 'Admin' || userRole === 'Manager';

  return (
    <div className="container mt-4">
      <h3>Task List</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3 row">
        <div className="col">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by assignee"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Status</th>
            {canDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const canEditStatus =
              userRole === 'Admin' ||
              userRole === 'Manager' ||
              (userRole === 'Member' && task.assignedTo === username);
            return (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>
                  {canEditStatus ? (
                    <select
                      className="form-select"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  ) : (
                    task.status
                  )}
                </td>
                {canDelete && (
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
