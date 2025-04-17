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
    echo json_encode(['message' => 'Failed to connect to database: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $name = $data['name'] ?? '';
    $type = $data['type'] ?? '';
    $is_custom = $data['isCustom'] ?? 0;
    $recipe_id = $is_custom ? null : ($data['recipeId'] ?? null);
    $date = $data['date'] ?? '';

    $meal = MealPlanning::addMeal($user_id, $name, $type, $is_custom, $recipe_id, $date, $conn);

    if ($meal) {
        http_response_code(201);
        echo json_encode($meal);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add meal']);
    }
}
?>
