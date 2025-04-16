//<?php
// require_once __DIR__ .  '/../database/database.php';
// header('Content-Type: application/json');

// $method = $_SERVER['REQUEST_METHOD'];

// if ($method === 'POST') {
//   // ADD COMMENT
//   $postId = $_POST['post_id'] ?? null;
//   $userId = $_POST['user_id'] ?? null;
//   $content = $_POST['content'] ?? null;
//   $parentId = $_POST['parent_id'] ?? null;

//   if (!$postId || !$userId || !$content) {
//     echo json_encode(['error' => 'Missing required fields']);
//     exit;
//   }

//   $stmt = $db->prepare("INSERT INTO comments (post_id, user_id, content, parent_id, created_at) VALUES (?, ?, ?, ?, NOW())");
//   $stmt->bind_param("iisi", $postId, $userId, $content, $parentId);
//   if ($stmt->execute()) {
//     echo json_encode(['success' => true, 'comment_id' => $stmt->insert_id]);
//   } else {
//     echo json_encode(['error' => 'Failed to add comment']);
//   }
//   $stmt->close();

// } elseif ($method === 'GET') {
//   // GET COMMENTS
//   $postId = $_GET['post_id'] ?? null;
//   if (!$postId) {
//     echo json_encode(['error' => 'Missing post_id']);
//     exit;
//   }

//   $stmt = $db->prepare("SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? AND c.parent_id IS NULL ORDER BY c.created_at DESC");
//   $stmt->bind_param("i", $postId);
//   $stmt->execute();
//   $result = $stmt->get_result();
//   $comments = [];

//   while ($row = $result->fetch_assoc()) {
//     $commentId = $row['id'];

//     // Fetch replies
//     $replyStmt = $db->prepare("SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.parent_id = ? ORDER BY c.created_at ASC");
//     $replyStmt->bind_param("i", $commentId);
//     $replyStmt->execute();
//     $replyResult = $replyStmt->get_result();
//     $replies = [];
//     while ($reply = $replyResult->fetch_assoc()) {
//       $replies[] = $reply;
//     }
//     $replyStmt->close();

//     $row['replies'] = $replies;
//     $comments[] = $row;
//   }

//   echo json_encode($comments);
//   $stmt->close();

// } else {
//   echo json_encode(['error' => 'Invalid request method']);
// }

//$db->close();