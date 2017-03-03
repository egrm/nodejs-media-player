var express = require('express');
var app = express();

app.use('/public', express.static('./app/public'))


app.set('view engine', 'ejs');
app.set('views', './app/views/');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/css/style.css', function (req, res) {
  res.send('you failed');
});

var server = app.listen(3000, function() {
  console.log('example app listening on port 3000!');
});
