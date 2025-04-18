<?php
ob_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once __DIR__ . '/../../database/database.php';
require_once '../models/comment.php';
require_once '../../users/User.php';

ini_set('display_errors', 'Off');

session_start();

$database = new Database("localhost", "root", "", "recipe_database");
$conn = $database->conn;

if (!$conn) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to connect to database']);
  exit;
}

$action = $_GET['action'] ?? null;

// GET COMMENTS
if ($action === 'getComments' && isset($_GET['postId'])) {
  $postId = intval($_GET['postId']);
  $comments = Comment::getCommentsByPostId($postId, $database);
  echo json_encode(['message' => 'Comments fetched successfully', 'data' => $comments]);
  exit;
}

// ADD COMMENT
if ($action === 'addComment' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents("php://input"), true);

  if (!isset($input['postId']) || !isset($input['content'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields']);
    exit;
  }

  $postId = intval($input['postId']);
  $content = trim($input['content']);

  $userId = $_SESSION['user_id'] ?? null;
  $userName = $_SESSION['username'] ?? 'Guest';

  if (!$userId) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
  }

  $success = Comment::addComment($postId, $userId, $userName, $content, $database);
  if ($success) {
    echo json_encode(['message' => 'Comment added successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to add comment']);
  }
  exit;
}

// DELETE COMMENT
if ($action === 'deleteComment' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $commentId = isset($_GET['commentId']) ? intval($_GET['commentId']) : null;
  
  if (!$commentId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing comment ID']);
    exit;
  }
  
  $userId = $_SESSION['user_id'] ?? null;
  
  if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
  }
  
  // Get the comment to verify ownership
  $comment = Comment::getCommentById($commentId, $database);
  
  if (!$comment) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Comment not found']);
    exit;
  }
  
  // Check if the current user owns this comment
  if ($comment['user_id'] != $userId) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'You can only delete your own comments']);
    exit;
  }
  
  $success = Comment::deleteComment($commentId, $database);
  
  if ($success) {
    echo json_encode(['success' => true, 'message' => 'Comment deleted successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete comment']);
  }
  exit;
}

// EDIT COMMENT
if ($action === 'editComment' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents("php://input"), true);

  $commentId = $input['commentId'] ?? null;
  $userId = $input['userId'] ?? null;
  $content = $input['content'] ?? '';

  if (!empty($commentId) && !empty($userId) && $content !== '') {
    $success = Comment::editComment($commentId, $userId, $content, $database);
    echo json_encode([
      "success" => $success,
      "message" => $success ? "Comment updated successfully" : "Failed to update comment",
      "received" => $input
    ]);
  } else {
    echo json_encode([
      "success" => false,
      "message" => "Missing fields",
      "received" => $input
    ]);
  }
  exit;
}

// Default fallback
http_response_code(400);
echo json_encode(['message' => 'Invalid request']);
