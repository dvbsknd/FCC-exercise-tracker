const { User } = require('../models');
module.exports = (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  user.save()
    .then(() => res.json({ username: user.username }))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: {
          message: 'Error while trying to save to database',
          error: err
        }
      })
    });
};
