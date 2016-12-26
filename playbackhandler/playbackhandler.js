
function play(playData, callback) {

    console.log('Play Data : ' + playData);
    var playData = JSON.parse(playData);
    console.log('Play URL : ' + playData.url);
    console.log('Play StartTime : ' + playData.startTime);
    console.log('Play SubtitleUrl : ' + playData.subtitleUrl);
    console.log('Play SubtitleCodec : ' + playData.subtitleCodec);

    var subtitleFile = null;
    if(playData.subtitleUrl != null) {
        subtitleFile = getSubtitleFile(playData.subtitleUrl, playData.subtitleCodec);
    }
    
    //--aidx 
    var args = ["--alpha", "127", "--pos", playData.startTime];
    //args.concat(["--win", "0 0 300 300"]);

    if(playData.subtitleUrl != null) {
        args.push("--subtitles");
        args.push(subtitleFile);
    }

    args.push(playData.url);
    
    var path = "omxplayer";
    var process = require('child_process');
    process.execFile(path, args, {}, function (error, stdout, stderr) {
        console.log('Player Closed');
        console.log('stdout: ' + stdout);
        console.log('error: ' + error);
        console.log('stderr: ' + stderr);
    });
}

function getSubtitleFile(subtitleUrl, codec) {

    var md5 = require('md5');
    var nameHash = md5(subtitleUrl);
    var subtitleFileName = '/tmp/subtitles/' + nameHash + "." + codec;
    console.log('Subtitle Filename: ' + subtitleFileName);

    var fs = require('fs');
    if (fs.existsSync(subtitleFileName)) {
        return subtitleFileName;
    }

    if(fs.existsSync('/tmp/subtitles') == false) {
        fs.mkdirSync('/tmp/subtitles');
    }

    // download file

    try {
        var request = require('sync-request');
        var res = request('GET', subtitleUrl);
        var subtitleData = res.getBody();
        fs.writeFileSync(subtitleFileName, subtitleData);
    }
    catch(e) {
        console.log("Error downloading subtitle file: " + e);
    }

    return subtitleFileName;
}

function stop(callback) {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.Stop"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function pause() {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.Pause"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function pause_toggle() {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.PlayPause"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function resume() {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.Play"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function get_position(callback) {

    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session",
        "--reply-timeout=1000",
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.freedesktop.DBus.Properties.Get", 
        "string:org.mpris.MediaPlayer2.Player",
        "string:Position"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
        else {
            //console.log('Process stdout: ' + stdout);
            var bits = stdout.trim().split(" ");
            //console.log('get_position Data: ' + bits[1]);
            callback(bits[1]);
        }
    });         
}

function set_position(data) {
    
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.SetPosition",
        "objpath:/not/used",
        "int64:" + data.toString()];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function set_alpha(data) {

    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.SetAlpha",
        "objpath:/not/used",
        "int64:" + data.toString()];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function get_audio_tracks(callback) {

    var command = "dbus-send";
    var arguments = [
        "--print-reply", 
        "--session",
        "--reply-timeout=2000",
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.ListAudio"];
    var process = require('child_process');
    
    get_audio_tracks_command(process, command, arguments, callback, 0);
}

function get_audio_tracks_command(process, command, args, callback, tryCount) {
    console.log("Run Command Try: " + tryCount);

    var enviroment;
    try {
        var fs = require('fs');
        var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
        enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    }
    catch(e) {
        console.log('Address load failed: ' + e);

        if(tryCount < 5) {
            sleep(2000).then(() => {
                get_audio_tracks_command(process, command, args, callback, tryCount + 1);
            });
        }
        return;
    }

    process.execFile(command, args, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);

            if(tryCount < 5) {
                sleep(2000).then(() => {
                    get_audio_tracks_command(process, command, args, callback, tryCount + 1);
                });
            }
        }
        else {
            console.log('Process stdout: ' + stdout);
			var start = stdout.indexOf("[");
			var end = stdout.indexOf("]");
			if(start > 0 && end > 0 && start < end) {
				var arrayData = stdout.substring(start+1, end);
				var streams = [];
				var lines = arrayData.split("\n");
				var x;
				for(x = 0; x < lines.length; x++) {
					var line = lines[x].trim();
					if(line.length > 0) {
						var lineSplit = line.split("\"");
						console.log(lineSplit);
						if(lineSplit.length == 3) {
							var data = lineSplit[1];
							console.log(data);
							var bits = data.split(":");
							var stream = {};
							stream.id = bits[0];
							stream.lang = bits[1];
							stream.name = bits[2];
							stream.codec = bits[3];
							stream.active = bits[4];
							streams.push(stream);
						}
					}
				}
			
				var jsonData = JSON.stringify(streams);
				console.log(jsonData);
				callback(jsonData);
			}
			else {
				return;
			}
        }
    }); 
}

function set_audio_track(data) {
    console.log("Setting Audio Track: " + data.toString());
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.SelectAudio",
        "int32:" + data.toString()];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
        else {
            console.log('Audio Track Select Result: ' + stdout);
        }
    });
}

function get_subtitle_tracks(callback) {

    var command = "dbus-send";
    var arguments = [
        "--print-reply", 
        "--session",
        "--reply-timeout=2000",
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.ListSubtitles"];
    var process = require('child_process');
    
    get_subtitle_tracks_command(process, command, arguments, callback, 0);
}

function get_subtitle_tracks_command(process, command, args, callback, tryCount) {
    console.log("Run Command Try: " + tryCount);

    var enviroment;
    try {
        var fs = require('fs');
        var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
        enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    }
    catch(e) {
        console.log('Address load failed: ' + e);

        if(tryCount < 5) {
            sleep(2000).then(() => {
                get_subtitle_tracks_command(process, command, args, callback, tryCount + 1);
            });
        }
        return;
    }

    process.execFile(command, args, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);

            if(tryCount < 5) {
                sleep(2000).then(() => {
                    get_subtitle_tracks_command(process, command, args, callback, tryCount + 1);
                });
            }
        }
        else {
            console.log('Process stdout: ' + stdout);
			var start = stdout.indexOf("[");
			var end = stdout.indexOf("]");
			if(start > 0 && end > 0 && start < end) {
				var arrayData = stdout.substring(start+1, end);
				var streams = [];
				var lines = arrayData.split("\n");
				var x;
				for(x = 0; x < lines.length; x++) {
					var line = lines[x].trim();
					if(line.length > 0) {
						var lineSplit = line.split("\"");
						console.log(lineSplit);
						if(lineSplit.length == 3) {
							var data = lineSplit[1];
							console.log(data);
							var bits = data.split(":");
							var stream = {};
							stream.id = bits[0];
							stream.lang = bits[1];
							stream.name = bits[2];
							stream.codec = bits[3];
							stream.active = bits[4];
							streams.push(stream);
						}
					}
				}
			
				var jsonData = JSON.stringify(streams);
				console.log(jsonData);
				callback(jsonData);
			}
			else {
				return;
			}
        }
    }); 
}

function set_subtitle_track(data) {
    console.log("Setting Subtitle Track: " + data.toString());
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.SelectSubtitle",
        "int32:" + data.toString()];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
        else {
            console.log('Subtitle Track Select Result: ' + stdout);
        }
    });
}

function show_subtitles() {
    console.log("Show Subtitles");
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.ShowSubtitles"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function hide_subtitles() {
    console.log("Hide Subtitles");
    var command = "dbus-send";
    var arguments = [
        "--print-reply=literal", 
        "--session", 
        "--dest=org.mpris.MediaPlayer2.omxplayer", 
        "/org/mpris/MediaPlayer2",
        "org.mpris.MediaPlayer2.Player.HideSubtitles"];
    var fs = require('fs');
    var address = fs.readFileSync('/tmp/omxplayerdbus.pi', 'ascii').trim();
    var process = require('child_process');
    var enviroment = {DBUS_SESSION_BUS_ADDRESS: address};
    
    process.execFile(command, arguments, {env: enviroment}, function (error, stdout, stderr) {
        if (error) {
            console.log('Process closed with error: ' + error);
        }
    });
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function processRequest(request, callback) {
    
    //console.log("request url : " + request.url);
    var url = require('url');
    var url_parts = url.parse(request.url, true);
    var action = url_parts.host;

    try {
        switch (action) {

            case 'play':
                var data = url_parts.query["data"];         
                play(data, callback);
                callback("Play Action");
                break;
            case 'stop':            
                stop(callback);
                callback("Stop Action");
                break;
            case 'get_position':            
                get_position(callback);
                break;
            case 'set_position':
                var data = url_parts.query["data"];         
                set_position(data);
                callback("Set Position Action");
                break;
            case 'set_alpha':
                var data = url_parts.query["data"];
                set_alpha(data);
                break;
            case 'pause_toggle':
                pause_toggle();
                break;             
            case 'pause':
                pause();
                break; 
            case 'resume':
                resume();
                break; 
            case 'get_audio_tracks':    
                get_audio_tracks(callback);
                break;
            case 'set_audio_track':
                var data = url_parts.query["data"];
                set_audio_track(data);
                break;
            case 'get_subtitle_tracks':    
                get_subtitle_tracks(callback);
                break;
            case 'set_subtitle_track':
                var data = url_parts.query["data"];
                set_subtitle_track(data);
                break;
            case 'show_subtitles':
                show_subtitles();
                break;
            case 'hide_subtitles':
                hide_subtitles();
                break; 
            default:
                console.log('playbackhandler:processRequest action unknown : ' + action);
                callback("");
                break;
        }
    }
    catch(e) {
        console.log("Error in linuxplayer protocol handler: " + e);
    }
}

function registerMediaPlayerProtocol(protocol) {

    protocol.registerStringProtocol('linuxplayer', function (request, callback) {
        processRequest(request, callback);
    });
}

exports.registerMediaPlayerProtocol = registerMediaPlayerProtocol;
