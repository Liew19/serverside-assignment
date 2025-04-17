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

$action = isset($_POST['action']) ? $_POST['action'] : '';

// Handle reset_password action
if ($action === 'reset_password') {
    // Get data from POST
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $token = isset($_POST['token']) ? trim($_POST['token']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Validate inputs
    $errors = [];
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    if (empty($token)) {
        $errors[] = 'Token is required';
    }
    
    if (empty($password)) {
        $errors[] = 'Password is required';
    } elseif (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters long';
    }
    
    if (!empty($errors)) {
        echo json_encode([
            'status' => 'error',
            'message' => implode(', ', $errors)
        ]);
        exit;
    }
    
    // Reset password
    $result = User::resetPassword($email, $token, $password, $conn);
    
    if ($result === false) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid or expired token. Please request a new password reset link.'
        ]);
        exit;
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Password has been reset successfully'
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