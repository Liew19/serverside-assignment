<?php
require_once __DIR__ . '/../users/User.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

session_start();

$conn = new mysqli("localhost", "root", "", "recipe_database");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to database: ' . $conn->connect_error]);
    exit;
}

// Get action from POST data
$action = isset($_POST['action']) ? $_POST['action'] : '';

// Handle forgot_password action
if ($action === 'forgot_password') {
    // Get email from POST data
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    
    // Validate email
    if (empty($email)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email is required'
        ]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email format'
        ]);
        exit;
    }
    
    // Check if email exists in users table
    $sql = "SELECT user_id FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error, please try again later'
        ]);
        exit;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email not found in our records'
        ]);
        exit;
    }
    
    // Generate token
    $token = bin2hex(random_bytes(32)); // Generate a secure random token
    
    // Delete any existing tokens for this email
    $sql = "DELETE FROM password_resets WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error, please try again later'
        ]);
        exit;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    // Insert new token
    $sql = "INSERT INTO password_resets (email, token) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error, please try again later'
        ]);
        exit;
    }
    
    $stmt->bind_param("ss", $email, $token);
    if (!$stmt->execute()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error, please try again later'
        ]);
        exit;
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Email verified successfully',
        'token' => $token
    ]);
    exit;
} else {
    // Invalid action
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request'
    ]);
    exit;
}