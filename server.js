var http = require('http');
var url = require('url');
var moment = require('moment');

var port = 8080;

var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);

    var urlSpace = /%20/g;
    var forwardSlash = /\//g;
    var extraCharacters = /[^a-zA-z\s\d]/g;
    
    var parsedInput = parsedUrl.pathname
            .slice(1)
            .replace(urlSpace, ' ')
            .replace(forwardSlash, ' ')
            .replace(extraCharacters, '');
    
    var result = parseDate(parsedInput);
    
    if (result) {
       res.writeHead(200, { 'Content-Type': 'application/json' });
       res.end(JSON.stringify(result));
    } else {
       res.writeHead(404);
       res.end();
    }
});

server.listen(port, function() {
    console.log('Listening on port ' + port);
});


function parseDate(input) {

    var momentDate = moment(input, ['MMMM D YYYY', 'D MMMM YYYY'], true);
    
    if (!momentDate.isValid()) {
        momentDate = moment(input, 'X', true);
    }
    
    if (!momentDate.isValid()) {
        return {
            unix: null,
            natural: null
        };
    }
    
    return {
        unix: momentDate.format('X'),
        natural: momentDate.format('MMMM D, YYYY')
    };
}