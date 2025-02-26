require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('./config/mongodb');
const userRoutes = require('./app/routes/userRoutes');
const authRoutes = require('./app/routes/authRoutes');
const {swaggerUi, swaggerSpec} = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRoutes);
app.use('/auth', authRoutes);


mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
