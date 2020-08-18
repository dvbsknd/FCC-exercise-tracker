const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.MONGO_DB,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);

const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  exercises: [exerciseSchema]
});

module.exports = mongoose.model('User', userSchema);
