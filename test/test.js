const request = require('supertest');
const app = require('../server'); 

describe('User API', () => {
  describe('GET /api/users/test', () => {
    it('should return a test message', async () => {
      const response = await request(app).get('/api/users/test');
      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Users Works');
    });
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .attach('avatar', 'path/to/image.jpg') // Replace with the actual path to an image file
        .field('name', 'John Doe')
        .field('email', 'john@example.com')
        .field('password', 'password123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
      }));
      // Add more assertions if needed
    });

    it('should return validation errors for invalid input data', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ name: '', email: 'invalid_email', password: 'short' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      // Add more assertions if needed
    });

    it('should return an error if the email already exists', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({ name: 'Jane Doe', email: 'john@example.com', password: 'password456' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({
        email: 'Email already exists!',
      }));
      // Add more assertions if needed
    });
  });

  describe('POST /api/users/login', () => {
    it('should login a user and return a token', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'john@example.com', password: 'password123' });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      // Add more assertions if needed
    });
  
    it('should return validation errors for invalid login input', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: '', password: '' });
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      // Add more assertions if needed
    });
  
    it('should return an error for incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'john@example.com', password: 'incorrect' });
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({
        password: 'Password incorrect',
      }));
      // Add more assertions if needed
    });
  
    it('should return an error for non-existing user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'nonexisting@example.com', password: 'password123' });
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual(expect.objectContaining({
        email: 'User not found',
      }));
      // Add more assertions if needed
    });
  });
  
  describe('GET /api/users/current', () => {
    it('should return the current user', async () => {
      const user = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
      const token = generateToken(user);
  
      const response = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }));
      // Add more assertions if needed
    });
  
    it('should return an error for an unauthorized request', async () => {
      const response = await request(app)
        .get('/api/users/current');
  
      expect(response.status).toBe(401);
      // Add more assertions if needed
    });
  });
  
});
