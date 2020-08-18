const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.MONGO_DB,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
