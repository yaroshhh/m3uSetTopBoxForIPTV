<?php
    $CFG = '{
        "player_type"      : "jwplayer",
        "jwplayer_cdn_url" : "JWPLAYER_CDN_URL",
        "demo_list"        : "demo.json"
    }';
    $CFG = json_decode($CFG);

    if(isset($_COOKIE['debug'])){
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    }
?>