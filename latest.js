var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var toSource = require('tosource');

var lms_url = "https://arkmachinetranslations.com/legendary-moonlight-sculptor-table-of-contents/";
var ark_url = "https://arkmachinetranslations.com/ark-the-legend-table-of-contents/";

exports.update = function(){
	request(lms_url, function(err, resp, body) {
		if (err) throw err;

		$ = cheerio.load(body);
		// TODO: scraping goes here!
		var data = $('#content .entry-content').html().split('<div class="wpcnt">');
		data = data[0].split('Volume ');
		data = data[data.length-1];
		var volume = "Volume " + data.substring(0, 2); 
		data = data.split('</a><br>');
		data = data[data.length-2];
		data = data.split(': <a href="');
		var chapter = data[0].substring(1,data[0].length);
		data = data[1].split('/">');
		var url = data[0];
		var desc = data[1];
		//console.log(desc);
		var latest = {
			volume: volume,
			chapter: chapter,
			url: url,
			desc: desc
		};
		latest = JSON.stringify(latest, null, 4);
		//console.log(latest);
		
		fs.writeFile('./latest.json', latest, function(err) {
			if(err) {
				return console.log(err);
			}
			//console.log("The file was saved!");
		}); 	
	});
}

exports.updateark = function(){
	request(ark_url, function(err, resp, body) {
		if (err) throw err;

		$ = cheerio.load(body);
		// TODO: scraping goes here!
		var data = $('#content .entry-content').html().split('<div class="wpcnt">');
		data = data[0].split('Volume ');
		data = data[data.length-1];
		var volume = "Volume " + data.substring(0, 2); 
		data = data.split('</a><br>');
		data = data[data.length-2];
		data = data.split(': <a href="');
		var chapter = "Space "+data[0].split(';')[1];
		data = data[1].split('/">');
		var url = data[0];
		var desc = data[1];
		//console.log(desc);
		var latest = {
			volume: volume,
			chapter: chapter,
			url: url,
			desc: desc
		};
		latest = JSON.stringify(latest, null, 4);
		//console.log(latest);
		
		fs.writeFile('./latestark.json', latest, function(err) {
			if(err) {
				return console.log(err);
			}
			//console.log("The file was saved!");
		}); 	
	});
}