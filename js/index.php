<?PHP
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/dependencies.php';

$dependencies = $vendor['js'];

//deal with js maps
if(isset($_GET['type']) && strpos($_GET['type'],'.map') !== false){
    @header('Content-Type: text/json');
    $map_name = basename($_GET['type'],'.map');
    if(isset($dependencies[$map_name])){
        die(file_get_contents($dependencies[$map_name].'.map'));
    }else{
        die('');
    }
}

//set content type
@header('Content-Type: text/javascript');
@header('Content-Encoding: gzip'); 
define('SKIP_HEADERS',true);

$data = '';

$local = isset($_GET['js']) ? explode(',',$_GET['js']) : [];

// load dependencies files
foreach($dependencies as $js_file){
    if(file_exists(__DIR__.'/'.$js_file)){
        $data .= file_get_contents(__DIR__.'/'.$js_file).PHP_EOL;
    }
}

// load vendor files
foreach($local as $js_file){
    if(file_exists(__DIR__.'/'.$js_file.'.js')){
        $data .= file_get_contents(__DIR__.'/'.$js_file.'.js').PHP_EOL;
    }
}

// remove unused characters like tab and new-line
//$data = preg_replace('/\s\/\/[^\n]*/',' ',$data);
//$data = str_replace(["\n","\r","\t"],' ',$data);
//$data = preg_replace('/\s{2,}/',' ',$data);
//$data = preg_replace('/\/\**\*\//',' ',$data);
$data = trim($data);
$output = gzencode($data);     
die($output);
?>