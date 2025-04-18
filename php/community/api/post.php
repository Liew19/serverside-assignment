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

session_start();
require_once __DIR__ . '/../../database/database.php';
require_once '../models/post.php';
require_once '../../users/User.php';
require_once '../models/like.php';
require_once '../models/comment.php';

$database = new Database("localhost", "root", "");
if (!$database->conn) {
  http_response_code(500);
  echo json_encode(['message' => 'Failed to connect to database']);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_REQUEST['action'] ?? '';

error_log("METHOD: $method, ACTION: $action");

// ========== AUTH CHECK ==========
if ($method === 'POST' && $action === 'check_status') {
  if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'No session']);
    exit();
  }

  $userID = $_POST['user_id'] ?? null;
  $admin = User::checkRole($userID, $database);

  if ($userID && $userID == $_SESSION['user_id']) {
    http_response_code(200);
    echo json_encode(["status" => true, "admin" => $admin]);
  } else {
    http_response_code(401);
    echo json_encode(['status' => 'Failed authentication']);
  }
  exit();
}

// ===== CREATE POST =====
if ($method === 'POST' && $action === 'createPost') {
  $userId = $_SESSION['user_id'] ?? null;
  
  if (!$userId) {
      http_response_code(401);
      echo json_encode(['success' => false, 'message' => 'Unauthorized']);
      exit;
  }
  
  $title = $_POST['title'] ?? '';
  $content = $_POST['content'] ?? '';
  $imagePath = null;

  // Handle image upload if present
  if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../../public/images/community/';
    
    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
            exit;
        }
    }

    $tmpName = $_FILES['image']['tmp_name'];
    $originalName = basename($_FILES['image']['name']);
    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    $newFilename = uniqid('post_', true) . '.' . $ext;
    $targetPath = $uploadDir . $newFilename;
    
    if (move_uploaded_file($tmpName, $targetPath)) {
      $imagePath = 'images/community/' . $newFilename;
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save image']);
        exit;
    }
  }

  $postId = Post::createPost($title, $content, $imagePath, $userId, $database);
  
  if ($postId) {
      echo json_encode(['success' => true, 'message' => 'Post created', 'post_id' => $postId]);
  } else {
      http_response_code(500);
      echo json_encode(['success' => false, 'message' => 'Database insert failed']);
  }
  exit;
}

// ========== DELETE POST ==========
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

// ========== UPDATE POST ==========
if ($method === 'POST' && $action === 'update_post') {
  $postId = $_POST['post_id'] ?? null;
  $title = $_POST['title'] ?? '';
  $content = $_POST['content'] ?? '';

  if (!$postId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Post ID is required']);
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


// ========== GET POST BY ID ==========
if ($method === 'GET' && $action === 'getPostById' && isset($_GET['postId'])) {
  $postId = (int) $_GET['postId'];
  $userId = $_SESSION['user_id'] ?? 1;

  $likeModel = new LikeModel();
  $result = Post::getPostById($postId, $database);

  if ($result) {
    $result['like_count'] = $likeModel->getLikeCount($postId);
    $result['liked_by_user'] = $likeModel->getLikeStatus($postId, $userId);

    http_response_code(200);
    echo json_encode(['message' => 'Post fetched successfully', 'data' => $result]);
  } else {
    http_response_code(404);
    echo json_encode(['message' => 'Post not found']);
  }
  exit();
}

// ========== SWITCH FOR GET ACTIONS ==========
if ($method === 'GET') {
  switch ($action) {
    case 'getAllPosts':
      $result = Post::getAllPosts($database);
      foreach ($result as &$post) {
        $postId = $post['post_id'];
        $post['likesCount'] = Post::getLikeCount($postId, $database);
        $post['commentsCount'] = Post::getCommentCount($postId, $database);
      }
      http_response_code(200);
      echo json_encode(['message' => 'Posts fetched successfully', 'data' => $result]);
      break;

    case 'getUserPosts':
      $userId = $_GET['userId'] ?? null;
      if (!$userId) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing userId']);
        break;
      }
      $posts = Post::getUserPosts($userId, $database);
      foreach ($posts as &$post) {
        $postId = $post['post_id'];
        $post['likesCount'] = Post::getLikeCount($postId, $database);
        $post['commentsCount'] = Post::getCommentCount($postId, $database);
      }
      http_response_code(200);
      echo json_encode(['message' => 'User posts fetched successfully', 'data' => $posts]);
      break;

    case 'getLatestPosts':
      $result = Post::getAllPosts($database);
      foreach ($result as &$post) {
        $postId = $post['post_id'];
        $post['likesCount'] = Post::getLikeCount($postId, $database);
        $post['commentsCount'] = Post::getCommentCount($postId, $database);
      }
      http_response_code(200);
      echo json_encode(['message' => 'Posts fetched successfully', 'data' => $result]);
      break;

      case 'getPopularPosts':
        $result = Post::getPopularPosts($database);
    
        foreach ($result as &$post) {
            $postId = $post['post_id'];
            $post['commentsCount'] = Post::getCommentCount($postId, $database);
        }
    
        http_response_code(200);
        echo json_encode(['message' => 'Popular posts fetched successfully', 'data' => $result]);
        break;
    

    default:
      http_response_code(400);
      echo json_encode(['message' => 'Invalid action for GET request']);
  }
  exit();
}

// ========== INVALID FALLBACK ==========
http_response_code(400);
echo json_encode(['message' => 'Invalid request method or action']);
exit();
?>
