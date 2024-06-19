import React, { useState, useEffect } from 'react';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${uuid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.uuid !== uuid));
      } else {
        setError('Error deleting user');
      }
    } catch (error) {
      setError('Error deleting user');
    }
  };

  const handleChangeRole = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${uuid}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => (user.uuid === uuid ? updatedUser : user)));
      } else {
        setError('Error changing role');
      }
    } catch (error) {
      setError('Error changing role');
    }
  };

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      {error && <p className="error">{error}</p>}
      <div className="user-grid">
        {users.map(user => (
          <div key={user.uuid} className="user-card">
            <p><strong>UUID:</strong> {user.uuid}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <div className="user-card-actions">
              <button
                onClick={() => handleDeleteUser(user.uuid)}
                className="btn-delete"
              >
                Delete
              </button>
              <button
                onClick={() => handleChangeRole(user.uuid)}
                className="btn-change-role"
              >
                Change Role
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
