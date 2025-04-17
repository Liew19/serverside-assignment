<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

session_start();
require_once __DIR__ . '/../database/database.php';
require_once __DIR__ . '/models/like.php';  

$database = new Database("localhost", "root", "", "database");
$conn = $database->conn;
$likeModel = new LikeModel();

if (!$conn) {
  http_response_code(500);
  echo json_encode(["message" => "Database connection failed"]);
  exit;
}

// Get the action from query parameters
$action = $_GET['action'] ?? '';

// Handle getLikeStatus action
if ($action === 'getLikeStatus' && isset($_GET['postId'])) {
  $postId = intval($_GET['postId']);
  $userId = $_SESSION['user_id'] ?? 1; // Default to 1 for testing purposes
  
  if (!$postId || !$userId) {
    http_response_code(400);
    echo json_encode(["message" => "Missing postId or not logged in"]);
    exit;
  }
  
  $liked = $likeModel->getLikeStatus($postId, $userId);
  $likeCount = $likeModel->getLikeCount($postId);
  
  echo json_encode([
    "liked" => $liked,
    "likeCount" => $likeCount
  ]);
  exit;
}

// Handle toggleLike action
if ($action === 'toggleLike' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents("php://input"), true);
  $postId = isset($input['post_id']) ? intval($input['post_id']) : 0;
  $userId = $_SESSION['user_id'] ?? 1;
  
  if (!$postId || !$userId) {
    http_response_code(400);
    echo json_encode([
      "success" => false, 
      "message" => "Missing post_id or not logged in",
      "postId" => $postId,
      "userId" => $userId
    ]);
    exit;
  }
  
  $liked = $likeModel->toggleLike($postId, $userId);
  $likeCount = $likeModel->getLikeCount($postId);
  
  echo json_encode([
    "success" => true,
    "liked" => $liked,
    "likeCount" => $likeCount
  ]);
  exit;
}

// If no valid action was specified
http_response_code(400);
echo json_encode(["message" => "Invalid action"]);
exit;