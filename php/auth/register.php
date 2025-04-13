<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow frontend domain, if front-end on port 3000 local host, edit if other ports
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Access-Control-Allow-Credentials: true"); // Allow cookies/auth headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");  // Allow the Cache-Control header
require_once "../users/User.php";

session_start();
$database = new Database("localhost", "root", "password", "database_recipe");

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'register') {
  $username = $_POST['username'];
  $email = $_POST['email'];
  $password = $_POST['password'];
  $register = User::register($username, $email, $password, $database);

  if ($register) {
    http_response_code(200);
    echo json_encode([
      'status' => 'success',
      'message' => 'Successful registration, please log in'
    ]);
  } else {
    http_response_code(400);
    echo json_encode(['message' => 'email duplicated, please try again']);
  }
}
