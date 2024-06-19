import React, { useState, useEffect } from 'react';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const currentUsername = localStorage.getItem('currentUsername');
        fetch(`http://localhost:3001/users?username=${currentUsername}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setMessage(data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setMessage('Error fetching users');
            });
    }, []);

    const handleDelete = (username) => {
        const currentUsername = localStorage.getItem('currentUsername');
        fetch(`http://localhost:3001/users/${username}?requester=${currentUsername}`, {
            method: 'DELETE'
        })
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);
                setUsers((prevUsers) => prevUsers.filter(user => user.username !== username));
            })
            .catch((error) => console.error('Error deleting user:', error));
    };

    const handleChangePassword = (username) => {
        const currentUsername = localStorage.getItem('currentUsername');
        fetch(`http://localhost:3001/users/${username}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword, requester: currentUsername })
        })
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);
                setNewPassword('');
            })
            .catch((error) => console.error('Error changing password:', error));
    };

    const handleChangeRole = (username) => {
        const currentUsername = localStorage.getItem('currentUsername');
        fetch(`http://localhost:3001/users/${username}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newRole, requester: currentUsername })
        })
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);
                setNewRole('');
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.username === username ? { ...user, role: newRole } : user
                    )
                );
            })
            .catch((error) => console.error('Error changing role:', error));
    };

    return (
        <div className="user-list-container">
            <h2>All Users</h2>
            {message && <p className="message">{message}</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>UUID</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.username}>
                            <td>{user.username}</td>
                            <td>{user.uuid}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDelete(user.username)}>Delete</button>
                                <button onClick={() => handleChangePassword(user.username)}>Change Password</button>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                />
                                <button onClick={() => handleChangeRole(user.username)}>Change Role</button>
                                <input
                                    type="text"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    placeholder="New Role"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
