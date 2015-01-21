var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var http = require('http');
var app = express();

app.use(morgan('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
// app.use(gzippo.staticGzip("" + __dirname + "/app"));

app.listen(process.env.PORT || 5000);

app.get('/bitstamp', function(req, res){

  var options = {
    host: 'www.bitstamp.net',
    path: '/api/order_book/'
  };

  var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(str);
      res.end();
    });
  }

  http.request(options, callback).end();

});