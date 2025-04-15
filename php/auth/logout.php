<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow frontend domain
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
header("Access-Control-Allow-Credentials: true"); // Allow cookies/auth headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");  // Allow the Cache-Control header

session_start();

// Clear all session variables
$_SESSION = array();

// If it's desired to kill the session, also delete the session cookie.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session.
session_destroy();

// Return success response
echo json_encode([
    'status' => 'success',
    'message' => 'Logged out successfully'
]);
?>
