<?php
class Comment {
  public static function getCommentsByPostId($postId, $database) {
    $conn = $database->conn;
    $query = "SELECT c.comment_id, c.comment, c.created_at, c.username, c.user_id 
              FROM comments c
              JOIN users u ON c.user_id = u.user_id
              WHERE c.post_id = ? AND c.isDeleted = 0
              ORDER BY c.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $postId); 
    $stmt->execute();
    $result = $stmt->get_result();
  
    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
    return $comments;
  }

public static function addComment($postId, $userId, $userName, $comment, $database) {
  $sql = "INSERT INTO comments (post_id, user_id, username, comment) 
          VALUES (?, ?, ?, ?)";
  $stmt = $database->conn->prepare($sql);
  $stmt->bind_param("iiss", $postId, $userId, $userName, $comment); // Bind the correct variable for content
  return $stmt->execute();
}

public static function deleteComment($commentId, $database) {
  $sql = "UPDATE comments SET isDeleted = 1 WHERE comment_id = ?";
  $stmt = $database->conn->prepare($sql);
  $stmt->bind_param("i", $commentId);
  return $stmt->execute();
}
}
