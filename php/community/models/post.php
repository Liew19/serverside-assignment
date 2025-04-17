<?php
ob_start();
require_once __DIR__ . '/../../database/database.php';

class Post
{
    public static function createPost($title, $content, $imagePath, $userId, $database)
    {
        $conn = $database->conn;

        if (empty($title) || empty($content) || empty($userId)) {
            return false; // Return false instead of die()
        }
        
        $sql = "INSERT INTO user_post (user_id, title, content, imageURL) 
                VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isss", $userId, $title, $content, $imagePath);

        if ($stmt->execute()) {
            return $conn->insert_id;
        } else {
            error_log("Query Error: " . mysqli_error($conn));
            return false;
        }
    }

    public static function getAllPosts($database)
    {
        $conn = $database->conn;
        $sql = "SELECT * FROM user_post WHERE isDeleted = 0 ORDER BY created_at DESC";
        $result = $conn->query($sql);

        if (!$result) {
            error_log("Query Error: " . mysqli_error($conn));
            return false;
        }

        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }

        return $posts;
    }

    public static function updatePost($postId, $title, $content, $database)
    {
        $conn = $database->conn;
        $sql = "UPDATE user_post SET title = ?, content = ?, updated_at = NOW() WHERE post_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $title, $content, $postId);
        return $stmt->execute();
    }

    public static function deletePost($postId, $database)
    {
        $conn = $database->conn;
        $sql = "UPDATE user_post SET isDeleted = 1 WHERE post_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $postId);
        return $stmt->execute();
    }

    public static function getPostById($postId, $database)
    {
        $conn = $database->conn;
        $sql = "SELECT * FROM user_post WHERE post_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $postId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public static function toggleLike($postId, $userId, $database)
    {
        $conn = $database->conn;

        $check = $conn->prepare("SELECT * FROM likes WHERE post_id = ? AND user_id = ?");
        $check->bind_param("ii", $postId, $userId);
        $check->execute();
        $checkRes = $check->get_result();

        if ($checkRes->num_rows > 0) {
            $del = $conn->prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?");
            $del->bind_param("ii", $postId, $userId);
            $del->execute();
            return -1;
        } else {
            $ins = $conn->prepare("INSERT INTO likes (post_id, user_id) VALUES (?, ?)");
            $ins->bind_param("ii", $postId, $userId);
            $ins->execute();
            return 1;
        }
    }

    public static function getLikeCount($postId, $db) {
        $stmt = $db->conn->prepare("SELECT COUNT(*) as count FROM likes WHERE post_id = ?");
        $stmt->bind_param("i", $postId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc()["count"];
    }
    
    public static function getCommentCount($postId, $db) {
        $stmt = $db->conn->prepare("SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND isDeleted = 0");
        $stmt->bind_param("i", $postId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc()["count"];
    }

    public static function getUserPosts($userId, $db) {
        $stmt = $db->conn->prepare("SELECT * FROM user_post WHERE user_id = ? AND isDeleted = 0 ORDER BY created_at DESC");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    
    public static function getPopularPosts($database) {
        $conn = $database->conn;
    
        $query = "
            SELECT 
                p.*, 
                COUNT(l.post_id) AS likesCount
            FROM 
                user_post p
            LEFT JOIN 
                likes l ON p.post_id = l.post_id
            WHERE 
                p.isDeleted = 0
            GROUP BY 
                p.post_id
            ORDER BY 
                likesCount DESC, p.created_at DESC
        ";
    
        $result = $conn->query($query);
    
        if (!$result) {
            error_log("Query Error: " . mysqli_error($conn));
            return false;
        }
    
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
    
        return $posts;
    }
    
}
?>