const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;
const usersFile = path.join(__dirname, 'users.json');
const algorithm = 'aes-256-ctr';
const secretKey = crypto.randomBytes(32); // Generate a 32-byte key for AES-256

app.use(cors());
app.use(bodyParser.json());

const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (hash) => {
    const parts = hash.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
};

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const encryptedPassword = encrypt(password);
    const user = { uuid: uuidv4(), username, password: encryptedPassword, role: 'user' };

    let users = [];
    if (fs.existsSync(usersFile)) {
        const data = fs.readFileSync(usersFile, 'utf8');
        users = JSON.parse(data);
    }

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    users.push(user);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    console.log(`User created: ${JSON.stringify(user)}`);
    res.status(200).json({ message: 'Sign-up successful' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!fs.existsSync(usersFile)) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const data = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(u => u.username === username);
    if (!user) {
        console.log('User not found:', username);
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const decryptedPassword = decrypt(user.password);
    console.log('Login attempt:', { username, password });
    console.log('Decrypted password:', decryptedPassword);

    if (password !== decryptedPassword) {
        console.log('Password mismatch:', { provided: password, expected: decryptedPassword });
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful:', user);
    res.status(200).json({ message: 'Login successful', user });
});


app.put('/update-profile', (req, res) => {
    const { currentUsername, newUsername, newPassword } = req.body;
    if (!currentUsername || (!newUsername && !newPassword)) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    if (!fs.existsSync(usersFile)) {
        return res.status(400).json({ message: 'User not found' });
    }

    const data = fs.readFileSync(usersFile, 'utf8');
    let users = JSON.parse(data);

    const userIndex = users.findIndex(u => u.username === currentUsername);
    if (userIndex === -1) {
        return res.status(400).json({ message: 'User not found' });
    }

    if (newUsername) {
        users[userIndex].username = newUsername;
    }
    if (newPassword) {
        users[userIndex].password = encrypt(newPassword);
    }

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Profile updated successfully' });
});

app.get('/users', (req, res) => {
    if (!fs.existsSync(usersFile)) {
        return res.status(404).json({ message: 'No users found' });
    }

    const data = fs.readFileSync(usersFile, 'utf8');
    const users = JSON.parse(data);
    res.status(200).json(users);
});

app.put('/users/:uuid/role', (req, res) => {
    const { uuid } = req.params;
    const { role } = req.body;

    if (!uuid || !role) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    if (!fs.existsSync(usersFile)) {
        return res.status(404).json({ message: 'User not found' });
    }

    const data = fs.readFileSync(usersFile, 'utf8');
    let users = JSON.parse(data);

    const userIndex = users.findIndex(u => u.uuid === uuid);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].role = role;
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Role updated successfully' });
});

app.delete('/users/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (!uuid) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    if (!fs.existsSync(usersFile)) {
        return res.status(404).json({ message: 'User not found' });
    }

    const data = fs.readFileSync(usersFile, 'utf8');
    let users = JSON.parse(data);

    users = users.filter(u => u.uuid !== uuid);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'User deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
