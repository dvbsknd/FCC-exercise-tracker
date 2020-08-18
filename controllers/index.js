const { User } = require('../models');
module.exports = {
  createUser: function (req, res) {
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
  },
  listUsers: function (req, res) {
    User.find()
      .then(users => res.json({ users }))
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: {
            message: 'Error while trying to retrieve users',
            error: err
          }
        });
      });
  },
  addExercise: (req, res, next) => {
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
      .then(user => res.json({ user }))
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: {
            message: 'Error while trying to update user',
            error: err
          }
        });
      });
  },
  listExercises: (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId, 'exercises')
      .then(user => {
        const { _id, exercises } = user;
        const exerciseCount = user.exercises.length;
        res.json({ _id, exercises, exerciseCount });
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
};
