var latest = require('./latest.js');


var displayLMS = function(err, data) {
  if (err) throw err; // Check for the error and throw if it exists.
  //console.log(data); // Otherwise proceed as usual.
};

var usingItNow = function(callback) {
  callback(null, 'get it?'); // I dont want to throw an error, so I pass null for the error argument
};


latest.update(displayLMS);
//latest.updateark();

/*
var myCallback = function(err,data) {
	//if (err) throw err;
  console.log('got data: '+data);
};

var usingItNow = function(callback) {
	var myError = new Error('My custom error!');
  callback(myError, 'get it?');
};

usingItNow(myCallback);
*/
// myCallback(usingItNow);