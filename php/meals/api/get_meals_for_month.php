<?php
// /php/meals/api/get_meals_for_month.php
require_once __DIR__ . '/../../database/database.php';
require_once __DIR__ . '/../models/MealPlanning.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

session_start();

$conn = new mysqli("localhost", "root", "", "recipe_database");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to connect to database: ' . $conn->connect_error]);
    exit;
}

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id']; // Make sure to define user_id from session

    if (!isset($_GET['year']) || !isset($_GET['month'])) {
        echo json_encode(['error' => 'Year and month are required']);
        exit;
    } else {
        $year = intval($_GET['year']);
        $month = intval($_GET['month']);
        $mealType = isset($_GET['type']) ? $_GET['type'] : null;
        
        $meals = MealPlanning::getMealsForMonth($user_id, $year, $month, $conn);
        
        if ($mealType && $mealType !== 'all') {
            $meals = array_filter($meals, function($meal) use ($mealType) {
                return $meal['type'] === $mealType;
            });
            $meals = array_values($meals);
        }
        echo json_encode($meals);
    }
}
?>