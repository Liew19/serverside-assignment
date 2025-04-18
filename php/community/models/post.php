<?php
ob_start();
require_once __DIR__ . '/../../database/database.php';

class Post
{
    public static function createPost($title, $content, $imagePath, $userId, $database)
    {
        $conn = $database->conn;
        if (empty($title) || empty($content) || empty($userId)) return false;

        $sql = "INSERT INTO user_post (user_id, title, content, imageURL) VALUES (?, ?, ?, ?)";
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
        // Join with users table to get username only
        $sql = "SELECT p.*, u.username as userName 
                FROM user_post p 
                LEFT JOIN users u ON p.user_id = u.user_id 
                WHERE p.isDeleted = 0 
                ORDER BY p.created_at DESC";
        $result = $conn->query($sql);

        if (!$result) {
            error_log("Query Error: " . mysqli_error($conn));
            return false;
        }

        $posts = [];
        while ($row = $result->fetch_assoc()) {
            // Add like and comment counts to each post
            $row['likesCount'] = self::getLikeCount($row['post_id'], $database);
            $row['commentsCount'] = self::getCommentCount($row['post_id'], $database);
            $posts[] = $row;
        }

        return $posts;
    }

    public static function updatePost($postId, $title, $content, $imagePath, $database)
    {
        $conn = $database->conn;

        if ($imagePath) {
            $sql = "UPDATE user_post SET title = ?, content = ?, imageURL = ?, updated_at = NOW() WHERE post_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssi", $title, $content, $imagePath, $postId);
        } else {
            $sql = "UPDATE user_post SET title = ?, content = ?, updated_at = NOW() WHERE post_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssi", $title, $content, $postId);
        }

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
        $sql = "SELECT p.*, u.username as userName 
                FROM user_post p 
                LEFT JOIN users u ON p.user_id = u.user_id 
                WHERE p.post_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $postId);
        $stmt->execute();
        $result = $stmt->get_result();
        $post = $result->fetch_assoc();
        
        if ($post) {
            // Add like and comment counts
            $post['likesCount'] = self::getLikeCount($post['post_id'], $database);
            $post['commentsCount'] = self::getCommentCount($post['post_id'], $database);
        }
        
        return $post;
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
        $stmt = $db->conn->prepare("SELECT p.*, u.username as userName 
                                   FROM user_post p 
                                   LEFT JOIN users u ON p.user_id = u.user_id 
                                   WHERE p.user_id = ? AND p.isDeleted = 0 
                                   ORDER BY p.created_at DESC");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            // Add like and comment counts
            $row['likesCount'] = self::getLikeCount($row['post_id'], $db);
            $row['commentsCount'] = self::getCommentCount($row['post_id'], $db);
            $posts[] = $row;
        }
        
        return $posts;
    }

    public static function getPopularPosts($database) {
        $conn = $database->conn;
    
        $query = "
            SELECT 
                p.*, 
                u.username as userName
            FROM 
                user_post p
            LEFT JOIN 
                users u ON p.user_id = u.user_id
            WHERE 
                p.isDeleted = 0
            ORDER BY 
                p.created_at DESC
        ";
    
        $result = $conn->query($query);
    
        if (!$result) {
            error_log("Query Error: " . mysqli_error($conn));
            return false;
        }
    
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            // Add like and comment counts
            $row['likesCount'] = self::getLikeCount($row['post_id'], $database);
            $row['commentsCount'] = self::getCommentCount($row['post_id'], $database);
            $posts[] = $row;
        }
        
        // Sort by likes count after adding the data
        usort($posts, function($a, $b) {
            return $b['likesCount'] - $a['likesCount'];
        });
    
        return $posts;
    }
}
?>
