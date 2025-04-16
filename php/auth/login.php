<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow frontend domain, if front-end on port 3000 local host, edit if other ports
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Access-Control-Allow-Credentials: true"); // Allow cookies/auth headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");  // Allow the Cache-Control header
require_once "../users/User.php";


session_start();
$conn = new mysqli("localhost", "root", "password", "database_test2");
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'login') {
  $email = $_POST['email'];
  $password = $_POST['password'];
  $user = User::login($email, $password, $conn);    //return user assoc_array, fields include user_id, username, email, role

  if ($user) {
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['username'] = $user['username'];    //check for isset(COOKIE user_id) then compare SESSION user_id is enough, means logged in  
    $_SESSION['role'] = $user['role'];
    http_response_code(200);
    echo json_encode([
      'status' => 'success',
      'message' => 'logged in successfully',
      'user_id' => $user['user_id'],
      'username' => $user['username'],
    ]);
    setcookie("user_id", $user['user_id'], 0, '/');
    setcookie("username", $user['username'], 0, '/');
    setcookie("role", $user['role'], 0, '/');
  } else {
    http_response_code(400);
    echo json_encode(['message' => 'Please check your username and password']);
  }
}
