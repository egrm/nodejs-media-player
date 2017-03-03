var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', './views/');

app.get('/', function (req, res) {
  res.send('hello world');
});

var server = app.listen(3000, function() {
  console.log('example app listening on port 3000!');
});
