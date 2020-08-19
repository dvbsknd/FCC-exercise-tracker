const mongoose = require('mongoose');
const { User } = require('../models');

const createUser = (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  user.save()
    .then(user => res.json(user))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Error while trying to save to database',
          error: err
        }
      });
    });
};

const listUsers = (req, res) => {
  User.find()
  .then(users => res.json(users.map(user => user.username)))
  .catch(err => {
    console.error(err);
    res.status(500).json({
      error: {
        message: 'Error while trying to retrieve users',
        error: err
      }
    });
  });
};

const addExercise = (req, res, next) => {
  const {
    userId,
    description,
    duration } = req.body;
  const date = req.body.date || undefined;
  const exercise = {
    description,
    duration,
    date
  };
  const options = {
    new: true
  }
  User.findByIdAndUpdate(userId, { $push: { exercises: exercise } }, options)
    .then(user => {
      const { exercises } = user;
      const exercise = exercises[exercises.length - 1];
      const niceDate = new Date(exercise.date).toDateString();
      res.json({
        username: user.username,
        description: exercise.description,
        duration: Number(exercise.duration),
        _id: user._id,
        date: niceDate
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Error while trying to update user',
          error: err
        }
      });
    });
};

const listExercises = (req, res, next) => {
  const { userId, from, to, limit } = req.query;
  const mongooseId = mongoose.Types.ObjectId(userId);
  const filters = [
    { $match: { '_id': mongooseId } },
  ];
  if (from) filters.push({ $match: { 'exercises.date': { $gte: new Date(from) } } });
  if (to) filters.push({ $match: { 'exercises.date': { $lte: new Date(to) } } });
  if (limit) filters.push({ $limit: Number(limit) });
  User.aggregate(filters)
    .then(data => {
      const { _id, username, exercises } = data[0];
      res.json({
        _id,
        username,
        log: exercises,
        count: exercises.length
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Error while trying to retrieve exercise log',
          error: err
        }
      });
    });
}

module.exports = {
  createUser,
  listUsers,
  addExercise,
  listExercises
};
