import React, { useState, useEffect } from 'react';

function TaskForm({ token, onSave, taskToEdit, userRole }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('To Do');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setAssignedTo(taskToEdit.assignedTo);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const method = taskToEdit ? 'PUT' : 'POST';
      const url = taskToEdit
        ? `http://localhost:5000/api/tasks/${taskToEdit._id}`
        : 'http://localhost:5000/api/tasks';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, assignedTo, status }),
      });

      const data = await response.json();
      if (response.ok) {
        onSave(data);
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setStatus('To Do');
      } else {
        setError(data.message || 'Failed to save task');
      }
    } catch {
      setError('Server error');
    }
  };

  // Members cannot assign tasks or change status except their own status update
  const isMember = userRole === 'Member';
  const disableFields = isMember && !taskToEdit;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h3>{taskToEdit ? 'Edit Task' : 'Create Task'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={disableFields}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disableFields}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Assigned To</label>
          <input
            type="text"
            className="form-control"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
            disabled={disableFields}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isMember && (!taskToEdit || taskToEdit.assignedTo !== assignedTo)}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={disableFields}>
          {taskToEdit ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
