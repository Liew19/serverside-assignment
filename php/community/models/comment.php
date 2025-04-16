//<?php
// class Comment {
//   public static function getCommentsByPostId($postId, $database) {
//     $sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC";
//     $stmt = $database->conn->prepare($sql);
//     $stmt->bind_param("i", $postId);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $comments = [];
//     while ($row = $result->fetch_assoc()) {
//       $comments[] = $row;
//     }
//     return $comments;
//   }

//   public static function addComment($postId, $userId, $userName, $userAvatar, $content, $database) {
//     $sql = "INSERT INTO comments (post_id, user_id, user_name, user_avatar, content, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
//     $stmt = $database->conn->prepare($sql);
//     $stmt->bind_param("iisss", $postId, $userId, $userName, $userAvatar, $content);
//     return $stmt->execute();
//   }
//}
