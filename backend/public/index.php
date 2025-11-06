<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\TodoController;

// load env (simple)
if (file_exists(__DIR__ . '/../.env')) {
    $env = parse_ini_file(__DIR__ . '/../.env');
    foreach ($env as $k=>$v) putenv("$k=$v");
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// simple routing
$controller = new TodoController();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$parts = array_values(array_filter(explode('/', $path)));

if (count($parts) === 0) {
    echo "Todo API";
    exit;
}

if ($parts[0] !== 'todos') {
    http_response_code(404);
    echo json_encode(['error'=>'Not found']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET' && count($parts) === 1) {
    $controller->index();
}

elseif ($method === 'GET' && count($parts) === 2) {
    $controller->show(intval($parts[1]));
}

elseif ($method === 'POST' && count($parts) === 1) {
    $controller->store($body ?? []);
}

elseif (($method === 'PUT' || $method === 'PATCH') && count($parts) === 2) {
    $controller->update(intval($parts[1]), $body ?? []);
}

elseif ($method === 'DELETE' && count($parts) === 2) {
    $controller->destroy(intval($parts[1]));
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

