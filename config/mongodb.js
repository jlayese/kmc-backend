const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

module.exports = mongoose;
