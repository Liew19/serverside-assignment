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
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to connect to database: ' . $conn->connect_error]);
    exit;
}

// Get all recipes with optional limit
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['action'])) {
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : null;
    $result = Recipe::getAllRecipes($conn, $limit);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to fetch recipes']);
    }
}

// Get recipe by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $_GET['id'];
    $result = Recipe::getRecipeById($id, $conn);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Recipe not found']);
    }
}

// Create new recipe
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    $recipeData = [
        'user_id' => $_SESSION['user_id'],
        'title' => $_POST['title'],
        'description' => $_POST['description'],
        'prep_time' => $_POST['prep_time'],
        'cook_time' => $_POST['cook_time'],
        'servings' => $_POST['servings'],
        'difficulty' => $_POST['difficulty'],
        'cuisine' => $_POST['cuisine'],
        'ingredients' => $_POST['ingredients'],
        'instructions' => $_POST['instructions'],
        'image_url' => $_POST['image_url'] ?? null
    ];

    $result = Recipe::createRecipe($recipeData, $conn);
    if ($result) {
        http_response_code(201);
        echo json_encode(['message' => 'Recipe created successfully', 'recipe_id' => $result]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to create recipe']);
    }
}

// Update recipe favorite status
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['id'])) {
    $recipe_id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $favourite = $data['favourite'];

    $result = Recipe::updateFavoriteStatus($recipe_id, $favourite, $conn);
    if ($result) {
        http_response_code(200);
        echo json_encode(['message' => 'Recipe updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update recipe']);
    }
}

// Get user's favorite recipes
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'favorites') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    $result = Recipe::getFavoriteRecipes($_SESSION['user_id'], $conn);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to fetch favorite recipes']);
    }
}

// Get recently viewed recipes
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'recently-viewed') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    $result = Recipe::getRecentlyViewed($_SESSION['user_id'], $conn);
    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to fetch recently viewed recipes']);
    }
}

// Add recipe to recently viewed
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'view') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    $recipe_id = $_POST['recipe_id'];
    $result = Recipe::addToRecentlyViewed($_SESSION['user_id'], $recipe_id, $conn);
    if ($result) {
        http_response_code(200);
        echo json_encode(['message' => 'Added to recently viewed']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to add to recently viewed']);
    }
}