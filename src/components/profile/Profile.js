import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const uuid = localStorage.getItem('uuid');

    useEffect(() => {
        const fetchProfile = async () => {
            const currentUsername = localStorage.getItem('currentUsername');
            setUsername(currentUsername);
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const currentUsername = localStorage.getItem('currentUsername');
        const response = await fetch('http://localhost:3001/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentUsername,
                newUsername,
                newPassword,
            }),
        });
        const data = await response.json();
        setMessage(data.message);
        if (data.message === 'Profile updated successfully') {
            if (newUsername) {
                localStorage.setItem('currentUsername', newUsername);
                setUsername(newUsername);
                setNewUsername('');
            }
            if (newPassword) {
                setNewPassword('');
            }
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile</h2>
                <div className="uuid-section">
                    <span className="uuid">{uuid}</span>
                </div>
            </div>
            <div className="profile-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder={username}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="********"
                    />
                </div>
                <button onClick={handleUpdateProfile} className="btn-update">
                    Update Profile
                </button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Profile;
