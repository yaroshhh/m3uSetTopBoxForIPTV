(function (){

    var rebuild_channels_menu = function(e){
        var nav,li,title,dropdown,type,x;
        nav = $("#m3u8List").html('');
        reset_li = $('<li/>').addClass('nav-item');
        reset_a = $('<a/>').addClass('nav-link').attr('href','#')
            .html('reset').on('mousedown', reload_page);
        nav.append(reset_li.append(reset_a));
        for(type in window.GROUPS){
            li = $('<li/>').addClass('nav-item dropdown');
            title = $('<a/>').addClass('nav-link dropdown-toggle')
                .attr('data-toggle',"dropdown").attr('href',"#")
                .attr('role',"button").attr('aria-haspopup',"true")
                .attr('aria-expanded',"false")
                .html(capitalize_str(type.replace('tv','')));
            dropdown = $('<div/>').addClass('dropdown-menu').attr('id',type+'-menu');
            for(x in window.GROUPS[type]){
                a = $('<a/>').attr('href','#').attr('id', type+'_'+x)
                    .addClass('dropdown-item').on('click', loadGroup)
                    .attr('data-type', type).attr('data-group', x)
                    .attr('title',x.replace(/_/g," "))
                    .text(x.replace(/_/g," "));
                dropdown.append(a);
            }

            nav.append(li.append([title,dropdown]));
        }
        nav.css('display','flex');

        if(Object.keys(window.GROUPS).length == 1){
            var type = Object.keys(window.GROUPS)[0];
            if(Object.keys(window.GROUPS[type]).length == 1){
                var group = Object.keys(window.GROUPS[type])[0];
                loadGroup(type+'_'+group);
                return;
            }
        }
        $('#iframe_player').attr('src','dummy.html');
    };
    var reload_page = function(){
        window.top.location.reload();
    };
    var capitalize_str = function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    var create_playlist = function (stream){
        return [{
            file: stream['url'],
            type: 'mp4',
            image: stream['logo'],
            title: stream['title'],
            description: stream['group-title']
          }];
    }
    var player_callback_gen = function(stream){
        return () => {
            var iframe = document.querySelector('iframe');
            var message = {
                "jwplayer": [
                    {
                        /*
                        "action":"playlistItem",
                        "params":[pid]
                        */
                       "action": "load",
                       "params": [create_playlist(stream)]
                    }
                ]
            };
            iframe.contentWindow.postMessage(message, "*");
            window.top.scrollTo({ top: 0, behavior: 'smooth' });
        };
    };
    var loadGroup = function(e){
        if(typeof e == 'string'){
            var a = $('#'+e);
        }else{
            var a = $(e.target);
        }
        var classActive = 'btn-outline-light';
        var group = a.attr('data-group');
        var type = a.attr('data-type');
        var channels = $('#channels');
        $("#m3u8List").find('.'+classActive).removeClass(classActive);
        a.addClass(classActive);
        $('#iframe_player').attr('src',window.PLAYER+'.php?type='+type+'&group='+group);
        channels.html('');
        var i=0;
        for(x in window.GROUPS[type][group]){
            var stream = window.STREAMS[type][ window.GROUPS[type][group][x] ];
            //if(stream == undefined) continue;
            var title = $('<h5/>').html(stream.title).addClass('mt-0 mb-1');
            var img   = stream.logo ? $('<img/>').attr('src',stream.logo) : $("<div/>");
            img.addClass('align-self-center mx-2 px-1').attr('alt',stream.name)
               .width('64px').height('*');
            var body  = $('<div/>').addClass('media-body align-self-center').append(title);
            var media = $('<li/>').attr('data-channel', x.id).addClass('media').append([img, body]);
            var pid = eval("i");
            media.on('mousedown', player_callback_gen(stream));
            channels.append(media);
            i++;
        }
    };

    window.addEventListener('M3ULoaded', rebuild_channels_menu);

})();

