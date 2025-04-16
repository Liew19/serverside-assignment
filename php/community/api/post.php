<?php
ob_start();
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require_once __DIR__ .  '/../database/database.php';
require_once '../models/post.php';
require_once '../../users/User.php';

session_start();
$database = new Database("localhost", "root", "", "database");
if (!$database->conn) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to connect to database']);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_REQUEST['action'] ?? '';

file_put_contents("php://stderr", "METHOD: $method, ACTION: $action\n");
error_log("METHOD: $method, ACTION: $action");

//check user status, if cookie correct with session (user id)
if ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'check_status') {
  if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'No session']);
    exit();
  }

  $userID = $_POST['user_id'] ?? null;
  $admin = User::checkRole($userID, $database);

  if ($userID && $userID == $_SESSION['user_id']) {
    http_response_code(200);
    if ($admin) {
      echo json_encode(["status" => true, "admin" => true]);
    } else {
      echo json_encode(["status" => true, "admin" => false]);
    }
  } else {
    http_response_code(401);
    echo json_encode(['status' => 'Failed authentication']);
  }
  exit();
}

if ($method === 'GET' && $action === 'getAllPosts') {
  $result = Post::getAllPosts($database);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Posts fetched successfully', 'data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch posts']);
  }
  exit();
}

if ($method === 'POST' && $action === 'createPost') {
  file_put_contents("php://stderr", "Inside createPost handler\n");

  $title = $_POST['title'] ?? '';
  $content = $_POST['content'] ?? '';
  $userId = $_POST['user_id'] ?? ($_SESSION['user_id'] ?? null);
  $imageURL = '';

  // if (!$userId) {
  //   http_response_code(401);
  //   echo json_encode(['message' => 'Unauthorized: Missing user ID']);
  //   exit();
  // }
  $userId = $_POST['user_id'] ?? 1; // use dummy user ID = 1

  if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../uploads/';
    $fileName = basename($_FILES['image']['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
      $imageURL = '/uploads/' . $fileName;
    }
  }

  $result = Post::createPost($title, $content, $imageURL, $userId, $database);
  if ($result) {
    http_response_code(201);
    echo json_encode(['message' => 'Post created successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to create post']);
  }
  exit();
}
else if ($method === 'POST' && $action !== 'createPost' && $action !== 'check_status') {
  http_response_code(400);
  echo json_encode(['message' => 'Invalid action for POST request']);
  exit();
}

if ($method === 'DELETE' && $action === 'delete_post') {
  $postId = $_GET['id'] ?? null;
  if (!$postId) {
    http_response_code(400);
    echo json_encode(['message' => 'Post ID is required']);
    exit();
  }

  $result = Post::deletePost($postId, $database);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Post deleted successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to delete post']);
  }
  exit();
}

if ($method === 'PUT' && $action === 'update_post') {
  parse_str(file_get_contents("php://input"), $put_vars);
  $postId = $put_vars['post_id'] ?? null;
  $title = $put_vars['title'] ?? '';
  $content = $put_vars['content'] ?? '';

  if (!$postId) {
    http_response_code(400);
    echo json_encode(['message' => 'Post ID is required']);
    exit();
  }

  $result = Post::updatePost($postId, $title, $content, $database);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Post updated successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to update post']);
  }
  exit();
}

if ($_GET['action'] === 'getPostById' && isset($_GET['postId'])) {
  $postId = (int) $_GET['postId'];
  error_log("Post ID received: " . $postId);

  $result = Post::getPostById($postId, $database);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Post fetched successfully', 'data' => $result]);
  } else {
    http_response_code(404);
    echo json_encode(['message' => 'Post not found']);
  }
  exit();
}

// Catch-all for unsupported methods/actions
http_response_code(400);
echo json_encode(['message' => 'Invalid request method or action']);
exit();
?>