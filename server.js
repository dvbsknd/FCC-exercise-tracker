const express = require('express')
const mongoose = require('mongoose')
const app = express()

const cors = require('cors')

app.use(cors())

app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Git/Glitch syncing webhook
const gitWebhook = require('./webhooks/git.js');
app.use('/git', gitWebhook);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
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

// Only start the app if the database is available
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.MONGO_DB,
  useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(db => {
    console.log(`Database ${db.connections[0].name} on ${db.connections[0].host} connected`);
    const listener = app.listen(process.env.PORT, function () {
      console.log('Your app is listening on port ' + listener.address().port);
    });
  })
  .catch(error => console.log('Datbase Error:', error));
