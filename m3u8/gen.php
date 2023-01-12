<?PHP
require_once __DIR__."/../config.php";

@header('Content-Type: application/x-mpegURL');
if(!isset($_GET['type'])){
    exit;
}
if('livetv' != $_GET['type']){
    exit;
}

if(!$list = json_decode(file_get_contents(__DIR__."/../db/".$CFG->demo_list), true)){
    exit;
}

?>
#EXTM3U

<?PHP foreach($list as $title => $channels){ ?>
<?PHP foreach($channels as $ch){ ?>
#EXTINF:-1 tvg-id="<?=$ch['id']?>" tvg-name="<?=$ch['id']?>" tvg-type="live" group-title="<?=$title?>" tvg-logo="<?=$ch['logo']?>",<?=$ch['title']?>

<?=$ch['url']?>


<?PHP } ?>
<?PHP } ?>