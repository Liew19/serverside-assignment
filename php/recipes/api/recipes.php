<?php
require_once '../models/Recipe.php';

// Set CORS headers to allow requests from your React application
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

// Start session for user authentication
session_start();

// Create database connection with required parameters
$conn = new mysqli("localhost", "root", "", "recipe_database");

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to connect to database: ' . $conn->connect_error]);
    exit;
}

// Get all recipes or recipe by ID
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Get recipe by ID
        $id = $_GET['id'];
        $result = Recipe::getRecipeById($id, $conn);
        if ($result) {
            http_response_code(200);
            // Return the recipe as an array with one item to match the React component's expectation
            echo json_encode([$result]);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Recipe not found', 'debug' => 'getRecipeById returned false']);
        }
    } else {
        // Get all recipes with optional limit and pagination
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $search = isset($_GET['search']) ? $_GET['search'] : '';

        // Try to get recipes
        $result = Recipe::getAllRecipes($conn, $limit);

        // Debug the result
        if ($result) {
            http_response_code(200);
            // Return the recipes array directly as expected by the React component
            echo json_encode($result);
        } else {
            // Get the last MySQL error
            $error = mysqli_error($conn);
            http_response_code(500);
            echo json_encode(['message' => 'Failed to fetch recipes', 'error' => $error, 'debug' => 'getAllRecipes returned false']);
        }
    }
}

// Create new recipe
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    // Get JSON data from request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON data']);
        exit;
    }

    $recipeData = [
        'user_id' => $_SESSION['user_id'],
        'title' => $data['title'],
        'description' => $data['description'],
        'prep_time' => $data['prep_time'],
        'cook_time' => $data['cook_time'],
        'servings' => $data['servings'],
        'difficulty' => $data['difficulty'],
        'cuisine' => $data['cuisine'],
        'ingredients' => $data['ingredients'],
        'instructions' => $data['instructions'],
        'image_url' => $data['image_url'] ?? null
    ];

    $result = Recipe::createRecipe($recipeData, $conn);
    if ($result) {
        http_response_code(201);
        echo json_encode(['message' => 'Recipe created successfully', 'id' => $result]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to create recipe']);
    }
}

// Update recipe
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Recipe ID is required']);
        exit;
    }

    $id = $_GET['id'];

    // Get JSON data from request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON data']);
        exit;
    }

    // Check if this is ONLY a favorite status update (only favourite property is present)
    if (isset($data['favourite']) && count($data) === 1) {
        // Check if user is logged in for favorite operations
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'User not logged in']);
            exit;
        }

        $result = Recipe::updateFavoriteStatus($id, $data['favourite'], $conn);
        if ($result) {
            // Get the updated recipe to return to the client
            $updatedRecipe = Recipe::getRecipeById($id, $conn);
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Recipe favorite status updated successfully',
                'recipe' => $updatedRecipe
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to update recipe favorite status']);
        }
    } else {
        // Full recipe update
        $recipeData = [
            'title' => $data['title'],
            'description' => $data['description'],
            'prep_time' => $data['prep_time'],
            'cook_time' => $data['cook_time'],
            'servings' => $data['servings'],
            'difficulty' => $data['difficulty'],
            'cuisine' => $data['cuisine'],
            'ingredients' => $data['ingredients'],
            'instructions' => $data['instructions'],
            'image_url' => $data['image_url'] ?? null
        ];

        $result = Recipe::updateRecipe($id, $recipeData, $conn);
        if ($result) {
            http_response_code(200);
            echo json_encode(['message' => 'Recipe updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update recipe']);
        }
    }
}

// Delete recipe
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'User not logged in']);
        exit;
    }

    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Recipe ID is required']);
        exit;
    }

    $id = $_GET['id'];

    // Check if user is admin
    require_once '../../users/User.php';
    $isAdmin = User::checkRole($_SESSION['user_id'], $conn);

    if ($isAdmin) {
        // Admin can delete any recipe
        $result = Recipe::deleteRecipe($id, $conn);
    } else {
        // Regular users can only delete their own recipes
        $recipe = Recipe::getRecipeById($id, $conn);
        if (!$recipe || $recipe['user_id'] != $_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(['message' => 'You do not have permission to delete this recipe']);
            exit;
        }

        $result = Recipe::deleteRecipe($id, $conn);
    }

    if ($result) {
        http_response_code(200);
        echo json_encode(['message' => 'Recipe deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to delete recipe']);
    }
}