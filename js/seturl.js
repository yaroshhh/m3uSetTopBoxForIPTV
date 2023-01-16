(function(){
    var url=null,url_input,
    demourl = '//'+location.host+'/',
    streamTypes = ['livetv','tvshows/1','movies',false];

    var GET_var = function(name) {
        return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1])
    }
    var demoMode = function(){
        url_input.type = 'hidden';
        url_input.value = demourl;
        setURL();
    }
    var setURL = function(){
        origin = document.location.href
        origin = origin.indexOf('?') > -1 ? origin.substring(0,origin.indexOf('?')) : origin;
        url =  origin + '?url=' + encodeURIComponent(url_input.value);
        if(event.keyCode && event.keyCode != 13) return;
        location = url
    }

    var LoadM3U = function(url,type,callback){
        if(type){
            url = url+'/m3u8/'+type;
        }else{
            type='IPTV';
        }
        $.ajax(
            {
                "url": url,
                "withCredentials": true,
                "success": function(data){
                    plotStatus('Loading items for '+type.split('/')[0]+'...');
                    var m3u = parseM3U(data, type);
                    if(!m3u){
                        return false;
                    }
                    if(typeof callback === "function"){
                        callback.call();
                    }

                }
        });
    }
    function isValidUrl(string) {
        try {
            new URL(string);
        } catch (_) {
            return false;  
        }
        
        return true;
    }
    var parseM3U = function(str,title){
        if(!title){
            title = 'video items'
        }
        var validation_fields = ['name','type'];
        var arr = str.split('\n');
        var streams = [];
        if(arr[0].indexOf('#EXTM3U') < 0){
            return false;
        }
        for(i=0;i<arr.length;i++){
            arr[i] = arr[i].trim();
            //ignore blank lines
            if(arr[i] == ''){
                continue;
            }

            // check if line represent url of #EXTINF before
            if(isValidUrl(arr[i])){
                var url = arr[i];
                var ch = streams[streams.length-1];
                if(!ch.url){
                    ch.url = [];
                }
                ch.url.push(url);
                ch.id = getChannelId(ch);
                streams[streams.length-1] = ch;
                continue;
            }

            // check if line represent #EXTINF
            arr[i] = arr[i].split(',');
            inf = arr[i][0].replace(/ /g,"_")
                .replace(/"_/g,"\" ").replace("_",' ').split(' ');

            if(inf[0].indexOf('#EXTINF') < 0){
                continue;
            }

            var ch = {};

            for(ii=1;ii<inf.length;ii++){

                var param = inf[ii].split('=');
                var key = param[0].replace('tvg-','');
                if(param.length < 2){
                    ch[key] = true;
                    continue;
                }

                ch[key] = param[1].split('"').join('');

            }

            if(arr[i].length > 1){
                ch['title'] = arr[i][1];
            }
            // check if #EXTINF attributes are valid
            var x;
            for(x in validation_fields){
                if(!ch[validation_fields[x]]){
                    console.error("validation faild for item "+i, ch);
                    continue;
                }
            }
            streams.push(ch);
        }
        if(streams.length > 0){
            //console.log(streams.length+" items found");
            loadStreamsList(streams);
            return true;
        }else{
            console.error("no streams found");
        }
    }
    var plotStatus = function(msg){
        var style = "color:white;font-size:16px;font-family:monospace";
        window.document.body.innerHTML += '<p style="'+style+'">'+msg+'</p>';
        $(window).trigger('resize');
    }
    var getChannelId = function(stream){
        if(stream.id.substring(0,2) == 'tt'){
            var regex = new RegExp(/S(\d+) E(\d+)$/, 'gi');
            var SE = stream.title.match(regex);
            if(SE){
                return stream.id+'/'+SE[0].split(' ').join('/');
            }
        }
        return stream.id;
    }
    var loadStreamsList = function(streams){

        for(i=0;i<streams.length;i++){
            ch=streams[i];
            var group = ch['group-title'] || false;
            var type = ch.type || 'live';
            var id = getChannelId(ch);
            if(typeof window.top.STREAMS[type] == "undefined"){
                window.top.STREAMS[type] = {};
                window.top.GROUPS[type] = {};
            }
            window.top.STREAMS[type][id] = ch;

            if(!group){
                group = 'other'
            }

            if(typeof window.top.GROUPS[type][group] == "undefined"){
                window.top.GROUPS[type][group] = [];
            }

            window.top.GROUPS[type][group].push(id);

        }
    }
    var triggerEvent = function(eventName){
                // Create the event.
                var event = document.createEvent('Event');

                // Define that the event name is 'build'.
                event.initEvent(eventName, true, true);
        
                // Target can be any Element or other EventTarget.
                window.top.dispatchEvent(event);
    }
    var wait = function(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }
    var initStreams = function(url){
        window.top.GROUPS = {};
        window.top.STREAMS = {};
        var callback,i;
        callback = function(){triggerEvent('M3ULoaded')};
        for(i=0;i<streamTypes.length;i++){
            var current = streamTypes[i];
            LoadM3U(url,current,callback);
            wait(1e3);
        }
    }
    return function(){
        document.addEventListener('DOMContentLoaded', (event) => {
            url_input = document.getElementById('url');
            url_input.value = url;
            document.getElementById('url').onkeydown=setURL;
            document.getElementById('load').onmousedown=setURL;
            document.getElementById('demo').onmousedown=demoMode;
            if(GET_var('url') != "null"){
                url = decodeURIComponent(GET_var('url'));
                plotStatus('Connecting to IPTV ...');
                initStreams(url);
            }else{
                document.getElementById('urlForm').style.display = 'block';
            }
        });
    }();

})()