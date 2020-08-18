const { User } = require('../models');
module.exports = {
  create: function (req, res) {
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
  list: function (req, res) {
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
  }
};
