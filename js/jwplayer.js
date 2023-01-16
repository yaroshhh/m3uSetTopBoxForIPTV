(function(){
    document.cookie = "promo_shown=1; Max-Age=2600000; Secure";
    var type,group,playlist,player,playerId='stb';

    var GET_var = function(name) {
        return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1])
    };

    var get_playlist = function(type,group){
        var ids = window.top.GROUPS[type][group];
        var i;
        var playlist = [];

        for(i=0;i<ids.length;i++){
            id = ids[i];
            ch = window.top.STREAMS[type][id];
            sources = get_playlist_sources(ch);
            if(!sources){
                continue;
            }
            item = {
                //"mediaid": ch.id,
                "sources": sources,
                "image": ch.logo || null,
                "title": ch.title,
                "description": group
            }    
            playlist.push(item);
        }
        return playlist;
    };
    var get_playlist_sources = function(ch){

        var sources = [];
        var i;

        if(!ch.url){
            return false;

        }else if(ch.url.length < 1){
            return false;
        }

        for(i=0;i<ch.url.length;i++){
            sources.push({
                "file":ch.url[i],
                "type": "mp4" //m3u8
            });
        }

        return sources;

    }
    var get_config = function(playlist){


        fulltext = group;

        return {
            "playlist": playlist,
            "displaydescription": true,
            "displayPlaybackLabel": true,
            "displaytitle": true,
            "nextUpDisplay":true,
            "cast": {},
            "mute":false,
            "abouttext": fulltext,
            "displaytitle": fulltext,
            "aspectratio": "16:9",
            "autostart": true,
            "autoplay" : true,
            "repeat": 'always',
            "related":{
                "displayMode": "shelfWidget",
                "selector": "shelf-widget"
            }
        };
    };

    var errHandler = function(callback){
        if(callback){
            console.error('disconnected',callback);
        }else{
            console.warn('disconnected');
        }
        bars = $('<img/>').attr('src',"images/bars_hd.gif").attr('width',"100%");
        placeholder = $('<a/>').attr('href','#').on('mousedown',build_player).append(bars);
        player.remove();
        $('#'+playerId).html('').append(placeholder);
    };
    var playerImprovments = {
        "removecontextmenu": function(){
            $(player.getContainer()).children().contextmenu(function(){
                setTimeout(function(){
                    document.getElementsByClassName('jw-rightclick')[0].style.display = 'none';
                },10);
            }); 
        },
        "addBackBtn": function(){
            if($('.jw-icon-prev').length > 0){
                return;
            }
            // The following code uses the addButton function from the JW Player API.
            player.addButton(
                '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-prev" viewBox="0 0 240 240"><path transform="translate(240, 0) scale(-1, 1) " d="M165,60v53.3L59.2,42.8C56.9,41.3,55,42.3,55,45v150c0,2.7,1.9,3.8,4.2,2.2L165,126.6v53.3h20v-120L165,60L165,60z"></path></svg>',
                'Previous',
                function() {
                    if (player.getPlaylistIndex() === 0) {
                        // If the user is at the first video in the playlist, loop around to the last video
                        player.playlistItem( Math.max(0, player.getPlaylist().length - 1) );
                    }
                    else {
                        // Otherwise, go to the previous video in the playlist
                        player.playlistItem( Math.max(0, player.getPlaylistIndex() - 1) ); 
                    }
                },
                'previous',
                'jw-icon-prev'
            );
            // The following line is a hack to move the button next to the "next" button
            // Note that this is not officially supported so use at your own risk. 
            // It has worked fine for me so far.
            $('.jw-controlbar .jw-icon-playback').before($('.jw-icon-prev'));
        },
        "overridestyles": function(){
            $.ajax(
                {
                    "url": 'css/jwplayer.css', 
                    "success": function(data){
                        style = $('<style/>').html(data)
                            .addClass('jwplayer-style-overrides');
                        $('head').append(style);
                    }
            });
        }
    };


    var onRemoteZipped = function(){
        $('.jw-icon-next').css('display','');
    }

    var build_player = function(){
        player = jwplayer(playerId);
        player.setup(config);
        player.on('ready', function(){
            //remote control the player by other windows
            window.addEventListener('message', function(event) {
                if(typeof event.data.jwplayer == undefined){
                    return false;
                }
                for(x in event.data.jwplayer){
                    var cmd = event.data.jwplayer[x];
                    if(cmd.action == 'load'){
                        var cfg = player.getConfig().setupConfig;
                        cfg.playlist = cmd.params[0];
                        cfg.playlist.type = null;
                        cfg.autostart = true;
                        player.setup(cfg);
                    }else{
                        player[cmd.action].call(this, cmd.params);
                    }
                    //console.info("user action triggered for "+cmd.action+"("+JSON.stringify(cmd.params)+")");
                }
            });
            player.on('error', errHandler);
            player.on('setupError', errHandler);
            player.on('playAttemptFailed', errHandler);
            player.on('firstFrame', onRemoteZipped);
            player.on('playlistItem', onRemoteZipped);
            var x;
            for(x in playerImprovments){
                var func = playerImprovments[x];
                if(typeof func === 'function'){
                    func.call();
                }
            }
            window.player = player;
        });

    };

    return (function(){
        type = GET_var('type');
        if(!type){
            console.error('cannot get current type');
            return;
        }

        group = GET_var('group');
        if(!group){
            console.error('cannot get current group');
            return;
        }

        playlist = get_playlist(type,group);
        if(!playlist){
            console.error('cannot get group channels');
            return;
        }

        config = get_config(playlist);
        if(!config){
            console.error('cannot get group\'s media properties');
        }
        //console.log("loading player with: ",config);
        build_player();
    })();

})();