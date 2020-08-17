// Webhook for updating Glitch via a Github adapted from
// https://github.com/nmcardoso/glitch-github-sync/
const express = require('express');
const router = express.Router();
const cmd = require('node-cmd');
const crypto = require('crypto');
const bodyParser = require('body-parser');

router.use((req, res, next) => {
  console.log('git.js accessed');
  next();
});
router.use(bodyParser.json());

const verifySignature = (req, res, next) => {
  const secret = process.env.GITHUB_SECRET;
  const checksum = req.headers['x-hub-signature'];
  const payload = JSON.stringify(req.body);
  if (!secret || !checksum || !payload) {
    return res.status(403).send('Missing header or body data.');
  };
  const hmac = crypto.createHmac('sha1', secret);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');

  if (checksum !== digest) {
    return res.status(403).send('Authentication failed.');
  }
  return next();

}

router.post('/', verifySignature, (req, res) => {
  if (req.headers['x-github-event'] == 'push') {
    cmd.get('bash ./scripts/git.sh', (err, data) => {
      if (err) return console.log(err);
      console.log(data);
      cmd.run('refresh');
      return res.status(200).send(data);
    });
  } else if (req.headers['x-github-event'] == 'ping') {
    return res.status(200).send('PONG');
  } else {
    return res.status(200).send('Unsuported Github event. Nothing done.');
  }
});

module.exports = router;
