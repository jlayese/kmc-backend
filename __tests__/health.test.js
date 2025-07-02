const request = require('supertest');
const express = require('express');

// Create a simple test app
const app = express();

// Add a health check endpoint for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

describe('Health Check', () => {
  test('should return 200 OK for health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });
});
