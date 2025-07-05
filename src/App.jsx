import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token, role, username) => {
    setToken(token);
    setRole(role);
    setUsername(username);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  };

  const handleSaveTask = () => {
    setTaskToEdit(null);
    setRefreshTasks(!refreshTasks);
  };

  if (!token) {
    return showRegister ? (
      <Register onRegister={() => setShowRegister(false)} />
    ) : (
      <>
        <Login onLogin={handleLogin} />
        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => setShowRegister(true)}>
            Register
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="container mt-4 ">
      <div className="d-flex gap-4 justify-content-center align-items-center">
        <h2>Collaborative Task Manager</h2>
      </div>
          <div className="d-flex justify-content-center">
  <button
    className="btn btn-danger"
    style={{ padding: '2px 6px', fontSize: '0.75rem' }}
    onClick={handleLogout}
  >
    Logout ({username})
  </button>
</div>
      <TaskForm
        token={token}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        userRole={role}
      />
      <TaskList
        token={token}
        userRole={role}
        username={username}
        key={refreshTasks} // to refresh list on task save
      />
    </div>
  );
}

export default App;
