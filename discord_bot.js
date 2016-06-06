// discord bot
try { var Discord = require("discord.js");} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!");
	process.exit();
}



try {var LmsIndex = require('./LmsIndex.json');}catch (e){console.log("missing LmsIndex.json");process.exit();}
try {var latest = require('./latest.js');} catch (e){console.log("missing latest.js");process.exit();}
try {var arktlIndex = require('./arktlIndex.json');} catch(e){ console.log("arktlindex invalid!\n"+e.stack);}

// Get authentication data
try { var AuthDetails = require("./auth.json");} catch (e){
	console.log("Please create an auth.json like auth.json.example with at least an email and password.\n"+e.stack);
	process.exit();
}

var commands = {
    "latest": {
        description: "display info on latest chapter",
        process: function(bot, msg) {
            
            var displayLMS = function(err, data) {
                var l_volume = data.volume;
                var l_chapter = data.chapter;
                var l_desc = data.desc;
                var l_url = data.url;
                if (err) throw err; // Check for the error and throw if it exists.
                bot.sendMessage(msg.channel, 
                    "**Moonlight Sculptor:** " + l_volume + ", " + l_chapter +
                    "\nDescription: " + l_desc +
                    "\nLink: <" + l_url +">"
                );
            };
            latest.update(displayLMS);
            var displayARK = function(err, data) {
                var arktl_l_volume = data.volume;
                var arktl_l_chapter = data.chapter;
                var arktl_l_desc = data.desc;
                var arktl_l_url = data.url;
                if (err) throw err; // Check for the error and throw if it exists.
                bot.sendMessage(msg.channel,
                    "**Ark the Legend:** " + arktl_l_volume + ", " + arktl_l_chapter +
                    "\nDescription: " + arktl_l_desc +
                    "\nLink: <" + arktl_l_url +">"
                );
            };

            latest.updateark(displayARK);
        }
    },
    "arktl": {
        description: "describe arktk chapter",
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "usage: !arktl volume# chapter#");
                return;
            }
            var data = query.split(" ");
            data[0] = data[0].replace(/\D/g,''); // strip non-numbers
            var volume = "volume" + data[0];
            var count_volumes = Object.keys(arktlIndex.volumes).length;

            if (data[0] < 1 || data[0] > count_volumes) { // volume not found
                bot.sendMessage(msg.channel, 
                    "Volume Not Found");
                return;
            }
            if(data[1] === undefined){ // display volume
                bot.sendMessage(msg.channel, 
                    "**Ark the Legend:** Volume " + data[0] +
                    "\nTranslators: " + arktlIndex.volumes[volume].translator +
                    "\nTranslator Url: <" + arktlIndex.volumes[volume].translatorurl +">");
                return;
            }
            data[1] = data[1].replace(/\D/g,''); // strip non-numbers
            var chapter = "chapter" + data[1];
            var count_chapters = Object.keys(arktlIndex.volumes[volume].chapters).length;

            if (data[1] < 1 || data[1] > count_chapters) { // chapter not found
                bot.sendMessage(msg.channel, 
                    "Chapter Not Found");
                return;
            }
            bot.sendMessage(msg.channel, // display volume and chapter
                "**Ark the Legend:** Volume " + data[0] + ", Chapter " + data[1] +
                "\nDescription: " + arktlIndex.volumes[volume].chapters[chapter].description +
                "\nLink: <" + arktlIndex.volumes[volume].chapters[chapter].url +">" );
            return;
        }
    },
    "lmsinfo": {
        description: "describe lms chapter",
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "usage: !lmsinfo volume# chapter#");
                //console.log(JSON.stringify(LmsIndex.volumes.volume1.translatorurl));
                //bot.sendMessage(msg.channel, " otherinfo: " + JSON.stringify(LmsIndex.volumes.volume1.translatorurl));
                return;
            }
            //console.log(query);
            var data = query.split(" ");

            data[0] = data[0].replace(/\D/g,''); // strip non-numbers
            var volume = "volume" + data[0];

            var count_volumes = Object.keys(LmsIndex.volumes).length;
            //console.log("number_of_volumes: " + count_volumes);

            if (data[0] < 1 || data[0] > count_volumes) {
                bot.sendMessage(msg.channel, 
                    "Volume Not Found");
                return;
            }

            if(data[1] === undefined){ // chapter undefined, give volume info instead
                //if (LmsIndex.volumes[volume].translator === undefined) console.log("translator undfined");
                //if (LmsIndex.volumes[volume].translatorurl === undefined) console.log("dflksd undefined");
                
                bot.sendMessage(msg.channel, 
                    "**Legendary Moonlight Sculptor:** Volume " + data[0] +
                    "\nTranslators: " + LmsIndex.volumes[volume].translator +
                    "\nTranslator Url: <" + LmsIndex.volumes[volume].translatorurl +">");
                return;
            }

            data[1] = data[1].replace(/\D/g,''); // strip non-numbers
            var chapter = "chapter" + data[1];
            var count_chapters = Object.keys(LmsIndex.volumes[volume].chapters).length;

            if (data[1] < 1 || data[1] > count_chapters) {
                bot.sendMessage(msg.channel, 
                    "Chapter Not Found");
                return;
            }

            bot.sendMessage(msg.channel, 
                "**Legendary Moonlight Sculptor:** Volume " + data[0] + ", Chapter " + data[1] +
                "\nDescription: " + LmsIndex.volumes[volume].chapters[chapter].description +
                "\nLink: <" + LmsIndex.volumes[volume].chapters[chapter].url +">" );
            return;
            //console.log("volume:" + data[0] + ", chapter:" + data[1]);
            //var myKey = "volume"+query;
            //console.log(JSON.stringify(LmsIndex.volumes[volume].translatorurl));
            //bot.sendMessage(msg.channel, "Hello World!" + LmsIndex.format_marker);
        }
    },

    "myid": {
        description: "returns the user id of the sender",
        process: function(bot,msg){bot.sendMessage(msg.channel,msg.author.id);}
    },

    "wiki": {
        usage: "<search terms>",
        description: "returns the summary of the first matching search result from lms wikia",
        process: function(bot,msg,suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel,"http://the-legendary-moonlight-sculptor.wikia.com/wiki/Main_Page");
                return;
            }

            query = query.replace(" ","+"); // replace space with "+"" for query
            query = escape(query);

            var wikidom = "http://the-legendary-moonlight-sculptor.wikia.com/";
            var wikiapi = "api/v1/";
            var wikirequest = wikidom + wikiapi + "Search/List?query=" + query + "&rank=default&limit=25&minArticleQuality=0&batch=1&namespaces=0%2C1";

            //sample: http://the-legendary-moonlight-sculptor.wikia.com/api/v1/Search/List?query=moonlight&limit=1&minArticleQuality=5&batch=0
            // http://the-legendary-moonlight-sculptor.wikia.com/api/v1/Search/List?query=dragon+of+chaos&rank=default&limit=25&minArticleQuality=0&batch=1&namespaces=0%2C1
            // jquery
            require("jsdom").env("",function(err,window){if(err){console.error(err);return;}
                var $ = require("jquery")(window);
                $.getJSON( wikirequest, {} ) // <-- json payload not used { name: "John", time: "2pm" }
                .done(function( data ) {
                    if ( data.exception === "NotFoundApiException" ) { console.log("Page Not Found"); } // not working but not causing bugs.
                    else {
                       bot.sendMessage(msg.channel, data.items[0].url);
                    }
                });
            });
        }
    }
};

var bot = new Discord.Client();

bot.on("ready", function () {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
	//require("./plugins.js").init();

    bot.setPlayingGame("!latest !lmsinfo !arktl");
    console.log("status set to: !latest !lmsinfo")
});

bot.on("disconnected", function () {

	console.log("Disconnected!");
	//process.exit(1); //exit node.js with an error

    setTimeout(function () {
        bot.loginWithToken(AuthDetails.token);
    }, 5000);
	
});

bot.on("message", function (msg) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0)){
        console.log("treating " + msg.content + " from " + msg.author + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(1);
        var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
        if(msg.content.indexOf(bot.user.mention()) == 0){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
			} catch(e){ //no command
				bot.sendMessage(msg.channel,"Yes?");
				return;
			}
        }
		var cmd = commands[cmdTxt];
        if(cmdTxt === "help"){
            //help is special since it iterates over the other commands
			bot.sendMessage(msg.author,"Available Commands:", function(){
				for(var cmd in commands) {
					var info = "!" + cmd;
					var usage = commands[cmd].usage;
					if(usage){
						info += " " + usage;
					}
					var description = commands[cmd].description;
					if(description){
						info += "\n\t" + description;
					}
					bot.sendMessage(msg.author,info);
				}
			});
        }
		else if(cmd) {
			try{
				cmd.process(bot,msg,suffix);
			} catch(e){
				bot.sendMessage(msg.channel, "command " + cmdTxt + " failed :(\n" + e.stack);
			}
		} else {
			//bot.sendMessage(msg.channel, "Invalid command " + cmdTxt);
		}
	} else {
		//message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return;
        }
        
        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                bot.sendMessage(msg.channel,msg.author + ", you called?");
        }
    }
});
 

//Log user status changes
/*
bot.on("presence", function(user,status,gameId) {
	//if(status === "online"){
	//console.log("presence update");
	console.log(user+" went "+status);
	//}
	try{
	if(status != 'offline'){
		if(messagebox.hasOwnProperty(user.id)){
			console.log("found message for " + user.id);
			var message = messagebox[user.id];
			var channel = bot.channels.get("id",message.channel);
			delete messagebox[user.id];
			updateMessagebox();
			bot.sendMessage(channel,message.content);
		}
	}
	}catch(e){}
});
*/

exports.addCommand = function(commandName, commandObject){
    try {
        commands[commandName] = commandObject;
    } catch(err){
        console.log(err);
    }
}
exports.commandCount = function(){
    return Object.keys(commands).length;
}

bot.loginWithToken(AuthDetails.token);
//bot.login(AuthDetails.email, AuthDetails.password);