<?php
require_once __DIR__ . '/../../database/database.php';

class LikeModel {
    private $conn;

    public function __construct() {
        $database = new Database("localhost", "root", "", "database");
        $this->conn = $database->conn;
    }

    public function getLikeStatus($postId, $userId) {
        $stmt = $this->conn->prepare("SELECT * FROM likes WHERE post_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $postId, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows > 0;
    }

    public function getLikeCount($postId) {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM likes WHERE post_id = ?");
        $stmt->bind_param("i", $postId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc()["count"];
    }

    public function toggleLike($postId, $userId) {
        if ($this->getLikeStatus($postId, $userId)) {
            // Unlike
            $stmt = $this->conn->prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?");
            $stmt->bind_param("ii", $postId, $userId);
            $stmt->execute();
            return false;
        } else {
            // Like
            $stmt = $this->conn->prepare("INSERT INTO likes (post_id, user_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $postId, $userId);
            $stmt->execute();
            return true;
        }
    }
}

