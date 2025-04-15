<?php
require_once '../models/Recipe.php';
require_once '../../database/database.php';
require_once '../../users/User.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Create a log file for debugging
function logError($message) {
    $logFile = __DIR__ . '/error_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Set up error handler to return JSON instead of HTML
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    $errorMsg = "PHP Error: [$errno] $errstr in $errfile on line $errline";
    logError($errorMsg);

    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $errstr,
        'file' => $errfile,
        'line' => $errline
    ]);
    exit;
});

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
$database = new Database("localhost", "root", "");

// Handle check_admin action
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Log the request
        logError("POST request received to admin.php");

        // Get the request body
        $input = file_get_contents('php://input');
        logError("Request body: " . $input);

        // Try to parse as JSON first
        $jsonData = json_decode($input, true);
        $jsonError = json_last_error();

        // Log JSON parsing result
        if ($jsonError !== JSON_ERROR_NONE) {
            logError("JSON parsing failed: " . json_last_error_msg());
        } else {
            logError("JSON parsed successfully: " . print_r($jsonData, true));
        }

        // If JSON parsing failed, try form data
        if ($jsonError !== JSON_ERROR_NONE) {
            parse_str($input, $postData);
            $action = isset($_POST['action']) ? $_POST['action'] : (isset($postData['action']) ? $postData['action'] : null);
            logError("Using form data, action: " . $action);
        } else {
            $action = isset($jsonData['action']) ? $jsonData['action'] : null;
            logError("Using JSON data, action: " . $action);
        }

        // Log session data
        logError("Session data: " . print_r($_SESSION, true));

        if ($action === 'check_admin') {
            if (!isset($_SESSION['user_id'])) {
                logError("User not logged in");
                echo json_encode(['success' => false, 'message' => 'User not logged in']);
                exit;
            }

            logError("Checking admin status for user ID: " . $_SESSION['user_id']);

            // Check if User class exists
            if (!class_exists('User')) {
                logError("User class does not exist");
                echo json_encode(['success' => false, 'message' => 'User class not found']);
                exit;
            }

            // Check database connection
            if (!$database->conn) {
                logError("Database connection failed");
                echo json_encode(['success' => false, 'message' => 'Database connection failed']);
                exit;
            }

            // Use checkRole method instead of isAdmin
            $isAdmin = User::checkRole($_SESSION['user_id'], $database);
            logError("Admin check result: " . ($isAdmin ? 'true' : 'false'));

            echo json_encode(['success' => true, 'is_admin' => $isAdmin]);
            exit;
        }
    } catch (Exception $e) {
        logError("Exception: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
        exit;
    }
}

// Check if user is admin for other admin actions
if (!isset($_SESSION['user_id']) || !User::checkRole($_SESSION['user_id'], $database)) {
    http_response_code(403);
    echo json_encode(['message' => 'Unauthorized access']);
    exit;
}

// Get all recipes (including deleted ones)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = Recipe::getAllRecipesAdmin($database);
    echo json_encode($result);
}

// Restore deleted recipe
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id) {
        $result = Recipe::restoreRecipe($id, $database);
        echo json_encode($result);
    }
}

// Permanently delete recipe
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id) {
        $result = Recipe::permanentlyDeleteRecipe($id, $database);
        echo json_encode($result);
    }
}