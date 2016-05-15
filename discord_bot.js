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

            latest.update(displayLMS);
            setTimeout(function () {
                latest.updateark(displayARK);
            }, 50); // 0 milliseconds
            
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
            var volume = "volume" + data[0];
            var chapter = "chapter" + data[1];
            //console.log(volume + "," + chapter);
            //console.log(JSON.stringify(arktlIndex.volumes[volume].chapters[chapter].description));
            if(data[1] === undefined){
                bot.sendMessage(msg.channel, 
                    "Ark the Legend: Volume " + data[0] +
                    "\nTranslators: " + arktlIndex.volumes[volume].translator +
                    "\nTranslator Url: <" + arktlIndex.volumes[volume].translatorurl +">");
                return;
            }else if(arktlIndex.volumes[volume].chapters[chapter] === undefined){
                bot.sendMessage(msg.channel, "Chapter Not Found");
            }
            else {
                var description = arktlIndex.volumes[volume].chapters[chapter].description;
                var url = arktlIndex.volumes[volume].chapters[chapter].url;
                bot.sendMessage(msg.channel, 
                "Ark the Legend: Volume " + data[0] + ", Chapter " + data[1] +
                "\nDescription: " + arktlIndex.volumes[volume].chapters[chapter].description +
                "\nLink: <" + arktlIndex.volumes[volume].chapters[chapter].url +">" );
            }
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
            console.log(query);
            var data = query.split(" ");
            var volume = "volume" + data[0];
            var chapter = "chapter" + data[1];

            if(data[1] === undefined){ // chapter undefined, give volume info instead
                console.log(
                //bot.sendMessage(msg.channel, 
                    "Volume " + data[0] +
                    "\nTranslators: " + LmsIndex.volumes[volume].translator +
                    "\nTranslator Url: <" + LmsIndex.volumes[volume].translatorurl +">");
                return;
            }

            if(LmsIndex.volumes[volume].chapters[chapter].description === undefined){
                console.log(
                //bot.sendMessage(msg.channel, 
                    "Chapter Not Found");
            }
            else {
                console.log(
                //bot.sendMessage(msg.channel, 
                "Legendary Moonlight Sculptor: Volume " + data[0] + ", Chapter " + data[1] +
                "\nDescription: " + LmsIndex.volumes[volume].chapters[chapter].description +
                "\nLink: <" + LmsIndex.volumes[volume].chapters[chapter].url +">" );
            }
            
            //console.log("volume:" + data[0] + ", chapter:" + data[1]);
            //var myKey = "volume"+query;
            //console.log(JSON.stringify(LmsIndex.volumes[volume].translatorurl));
            //bot.sendMessage(msg.channel, "Hello World!" + LmsIndex.format_marker);
        }
    },
    "myid": {
        description: "returns the user id of the sender",
        process: function(bot,msg){bot.sendMessage(msg.channel,msg.author.id);}
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
	process.exit(1); //exit node.js with an error
	
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