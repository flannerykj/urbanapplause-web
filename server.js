const fs = require('fs');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

app.disable('x-powered-by');
const origin = process.env.NODE_ENV === 'development' ? '*' : /\.digitaloceanspaces\.com$/ || /\.urbanapplause\.com$/;
app.use(cors({
  origin,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization', 'authorization']
}));
var aasa = fs.readFileSync(__dirname + '/.well-known/apple-app-site-association');

app.get('/apple-app-site-association', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.status(200).send(aasa);
})
app.use(express.static(path.join(__dirname, 'build')));
// declare a "catch all" route on your express server
// that captures all page requests and directs them to the client
// react-router does the routing from there.
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const port = process.env.PORT || 5000;
app.listen(
  port,
  function () {
    console.log(`Frontend start on port ${port}`)
  }
);
