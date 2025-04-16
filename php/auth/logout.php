<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

session_start();

setcookie(session_name(), "", time() - 3600, "/");
setcookie("role", "", time() - 3600, "/");
setcookie("username", "", time() - 3600, "/");
setcookie("user_id", "", time(), 3600, "/");

session_destroy();

echo json_encode([
    'status' => 'success',
    'message' => 'Logged out successfully'
]);
?>