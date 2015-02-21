
// A simple Node.js static file server for development use.
//
// To run, first install Node.js and Express, then run the shell command
// `node server.js`. Run in the background with `node server.js &`.
//
// This server does not do any caching, so your changed files
// will always update properly in the browser every time you save them.
//
// Curran Kelleher Feb 2015

// Racer setup
var liveDbMongo = require('livedb-mongo');
var racerBrowserChannel = require('racer-browserchannel');
var racer = require('racer');
racer.use(require('racer-bundle'));

/*
var store = racer.createStore({
  db: liveDbMongo('mongodb://localhost:27017/racer-vis?auto_reconnect', {safe: true})
});
*/

var port = 8000,
    express = require('express'),
    fs = require('fs'),
    app = express();

///////////////////////////// BEGIN RACER
// Racer + express integration
//app.use(racerBrowserChannel(store))
//app.use(store.modelMiddleware())

app.use("/racer", require("racer-middleware")({
  db: liveDbMongo('mongodb://localhost:27017/racer-vis?auto_reconnect', {safe: true}),
  routes: {
    'configs': function(req, model, done) {
      model.subscribe("configs", function(err) { 
        done();
      });
    }
  }
}));

// Serve static files.
app.use('/', express.static(__dirname));

// Start the server.
app.listen(port);

// Output a success message to the command line user.
console.log('Now serving at http://localhost:'+port);
