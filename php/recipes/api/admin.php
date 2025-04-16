<?php
require_once '../models/Recipe.php';
require_once '../../users/User.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
$conn = new mysqli("localhost", "root", "", "recipe_database");

// Handle check_admin action
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Log the request
        error_log("POST request received to admin.php");

        // Get the request body
        $input = file_get_contents('php://input');
        error_log("Request body: " . $input);

        // Try to parse as JSON first
        $jsonData = json_decode($input, true);
        $jsonError = json_last_error();

        // Log JSON parsing result
        if ($jsonError !== JSON_ERROR_NONE) {
            error_log("JSON parsing failed: " . json_last_error_msg());
        } else {
            error_log("JSON parsed successfully: " . print_r($jsonData, true));
        }

        // If JSON parsing failed, try form data
        if ($jsonError !== JSON_ERROR_NONE) {
            parse_str($input, $postData);
            $action = isset($_POST['action']) ? $_POST['action'] : (isset($postData['action']) ? $postData['action'] : null);
            error_log("Using form data, action: " . $action);
        } else {
            $action = isset($jsonData['action']) ? $jsonData['action'] : null;
            error_log("Using JSON data, action: " . $action);
        }

        // Log session data
        error_log("Session data: " . print_r($_SESSION, true));

        if ($action === 'check_admin') {
            if (!isset($_SESSION['user_id'])) {
                error_log("User not logged in");
                echo json_encode(['success' => false, 'message' => 'User not logged in']);
                exit;
            }

            error_log("Checking admin status for user ID: " . $_SESSION['user_id']);

            // Check if User class exists
            if (!class_exists('User')) {
                error_log("User class does not exist");
                echo json_encode(['success' => false, 'message' => 'User class not found']);
                exit;
            }

            // Check database connection
            if ($conn->connect_error) {
                error_log("Database connection failed: " . $conn->connect_error);
                echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
                exit;
            }

            // Use checkRole method instead of isAdmin
            $isAdmin = User::checkRole($_SESSION['user_id'], $conn);
            error_log("Admin check result: " . ($isAdmin ? 'true' : 'false'));

            echo json_encode(['success' => true, 'is_admin' => $isAdmin]);
            exit;
        }
    } catch (Exception $e) {
        error_log("Exception: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
        exit;
    }
}

// Check if user is admin for other admin actions
if (!isset($_SESSION['user_id']) || !User::checkRole($_SESSION['user_id'], $conn)) {
    http_response_code(403);
    echo json_encode(['message' => 'Unauthorized access']);
    exit;
}

// Get all recipes (including deleted ones)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = Recipe::getAllRecipesAdmin($conn);
    echo json_encode($result);
}

// Restore deleted recipe
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id) {
        $result = Recipe::restoreRecipe($id, $conn);
        echo json_encode($result);
    }
}

// Permanently delete recipe
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id) {
        $result = Recipe::permanentlyDeleteRecipe($id, $conn);
        echo json_encode($result);
    }
}