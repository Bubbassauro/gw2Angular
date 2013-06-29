//

var request = require('request');
var express = require('express');
var app = express();

app.get('/', function(req, res){
    console.log(req.url);

    var from = req.query["from"]; //query.from;

    request(from, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(new Date().toUTCString() + ' returning data from ' + from);
            res.writeHead(200, {"Content-Type": "application/javascript","Cache-Control": "public, max-age=600"});
            res.write(req.query.callback + '(' + body + ')');
        }
        else if(response.statusCode == 404) {
            console.log('page not found');
        }
        else {
            console.log(response);
        }
        res.end();
    })

});

app.listen(8888);
console.log('Listening on http://localhost:8888')