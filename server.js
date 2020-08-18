const express = require('express')
const mongoose = require('mongoose')
const { userController, exerciseController } = require('./controllers');
const app = express()

// CORS handling
const cors = require('cors')
app.use(cors())

// Body parsing
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Static files & HTML views
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Git/Glitch syncing webhook
const gitWebhook = require('./webhooks/git.js');
app.use('/git', gitWebhook);

// 'User' controller
app.use('/api/exercise/new-user/', userController);
app.use('/api/exercise/users/', userController);

// 'Exercise' controller
app.use('/api/exercise/add/', exerciseController);
app.use('/api/exercise/log/', exerciseController);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

// Start the app if the database is available
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.MONGO_DB,
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(db => {
    console.log(`Database ${db.connections[0].name} on ${db.connections[0].host} connected`);
    const listener = app.listen(process.env.PORT, function () {
      console.log('Server is listening on port ' + listener.address().port);
    });
  })
  .catch(error => console.log('Datbase Error:', error));
