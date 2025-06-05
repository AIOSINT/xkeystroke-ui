const request = require('supertest');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Mock modules used by scannerRoutes that are not needed for this test
jest.mock('multer', () => {
  const fn = () => ({ single: () => (req, res, next) => next() });
  fn.diskStorage = () => ({})
  return fn;
}, { virtual: true });
jest.mock('axios', () => ({}), { virtual: true });
jest.mock('yauzl', () => ({}), { virtual: true });
jest.mock('stream-to-buffer', () => ({}), { virtual: true });
jest.mock('form-data', () => function() {}, { virtual: true });

const decrypt = (secretKey, hash) => {
  const [ivHex, encryptedHex] = hash.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(secretKey, 'hex'), iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
};

beforeAll(done => {
  require('../server');
  setTimeout(done, 500);
});

describe('POST /login', () => {
  it('logs in with credentials from users.json', async () => {
    const basePath = path.join(__dirname, '..');
    const usersData = JSON.parse(fs.readFileSync(path.join(basePath, 'users.json')));
    const config = JSON.parse(fs.readFileSync(path.join(basePath, 'config.json')));
    const user = usersData.users[0];
    const password = decrypt(config.secretKey, user.password);

    const res = await request('http://localhost:3001')
      .post('/login')
      .send({ username: user.username, password });

    expect(res.status).toBe(200);
  });
});
