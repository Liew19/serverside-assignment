<?php
require_once __DIR__ . '/../models/MealPlanning.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

$conn = new mysqli("localhost", "root", "", "recipe_database");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to database: ' . $conn->connect_error]);
    exit;
}

// Handle both actual DELETE requests and POST requests with _method=DELETE
$json_str = file_get_contents('php://input');
$json_data = json_decode($json_str, true);

$methodOverride = $json_data['_method'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || 
    ($_SERVER['REQUEST_METHOD'] === 'POST' && $methodOverride === 'DELETE')) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'User not logged in']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    
    // Parse JSON input for POST requests with JSON body
    $json_data = null;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_str = file_get_contents('php://input');
        $json_data = json_decode($json_str, true);
        
        if (!$json_data || !isset($json_data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON or missing meal ID']);
            exit;
        }
        
        $meal_id = $json_data['id'];
    } else {
        // For actual DELETE requests
        if (isset($_GET['id'])) {
            $meal_id = $_GET['id'];
        } else {
            // Try to get ID from the request body for DELETE with body
            $json_str = file_get_contents('php://input');
            $json_data = json_decode($json_str, true);
            
            if (!$json_data || !isset($json_data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Meal ID is required']);
                exit;
            }
            
            $meal_id = $json_data['id'];
        }
    }
    
    $result = MealPlanning::deleteMeal($meal_id, $user_id, $conn);
    
    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to delete meal']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>