require('dotenv').config();

const express = require('express');
const cors = require('cors');

const mongoose = require('./config/mongodb');
const adminRoutesV1 = require('./app/routes/v1/adminRoutes');
const userRoutesV1 = require('./app/routes/v1/userRoutes');
const authRoutesV1 = require('./app/routes/v1/authRoutes');
const contactRoutesV1 = require('./app/routes/v1/contactRoutes');
const uploadRoutes = require('./app/helpers/upload');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/v1/images', uploadRoutes);
app.use('/api/v1/auth', authRoutesV1);
app.use('/api/v1/admin', adminRoutesV1);
app.use('/api/v1/users', userRoutesV1);
app.use('/api/v1/contacts', contactRoutesV1);

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
