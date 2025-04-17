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

// Read the input once
$rawInput = file_get_contents("php://input");
$json_data = json_decode($rawInput, true);

$methodOverride = $json_data['_method'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || 
    ($_SERVER['REQUEST_METHOD'] === 'POST' && $methodOverride === 'PUT')) {
    
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'User not authenticated']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    
    if (!$json_data || !isset($json_data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON or missing meal ID']);
        exit;
    }
    
    $meal_id = $json_data['id'];
    $name = $json_data['name'];
    $type = $json_data['type'];
    $is_custom = isset($json_data['isCustom']) ? ($json_data['isCustom'] ? 1 : 0) : 0;
    $recipe_id = $is_custom ? null : (isset($json_data['recipeId']) ? $json_data['recipeId'] : null);
    
    $meal = MealPlanning::getMealById($meal_id, $conn);
    
    if (!$meal || $meal['user_id'] != $user_id) {
        http_response_code(403);
        echo json_encode(['error' => 'You do not have permission to update this meal']);
        exit;
    }
    
    // Update the meal
    $result = MealPlanning::updateMeal($meal_id, $name, $type, $is_custom, $recipe_id, $conn);
    
    if ($result) {
        // Return the updated meal
        echo json_encode([
            'success' => true,
            'meal' => [
                'id' => $meal_id,
                'name' => $name,
                'type' => $type,
                'isCustom' => (bool)$is_custom,
                'recipeId' => $recipe_id,
                'date' => $meal['date']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update meal']);
    }
}
?>