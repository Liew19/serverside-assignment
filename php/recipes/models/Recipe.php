<?php
require_once __DIR__ . '/../../database/Database.php';

class Recipe {
    private $conn;
    private $table = 'recipes';

    public function __construct() {
        $database = new Database("localhost", "root", "");
        $this->conn = $database->connect();
    }

    public function getAllRecipesWithPagination($page = 1, $limit = 10, $search = '') {
        $offset = ($page - 1) * $limit;

        $query = "SELECT * FROM {$this->table}";
        if (!empty($search)) {
            $search = $this->conn->real_escape_string($search);
            $query .= " WHERE title LIKE '%$search%' OR description LIKE '%$search%'";
        }
        $query .= " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";

        $result = $this->conn->query($query);
        if (!$result) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        return ['success' => true, 'recipes' => $result->fetch_all(MYSQLI_ASSOC)];
    }

    // Get recipes created by a specific user
    public function getUserRecipes($user_id, $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;

        $stmt = $this->conn->prepare("
            SELECT * FROM {$this->table}
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ");

        if (!$stmt) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        $stmt->bind_param("iii", $user_id, $limit, $offset);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $recipes = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return ['success' => true, 'recipes' => $recipes];
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ['success' => false, 'error' => $error];
        }
    }

    // Count total recipes by user
    public function countUserRecipes($user_id) {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM {$this->table} WHERE user_id = ?");

        if (!$stmt) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        $stmt->bind_param("i", $user_id);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $count = $result->fetch_assoc()['total'];
            $stmt->close();
            return ['success' => true, 'total' => $count];
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ['success' => false, 'error' => $error];
        }
    }

    public function getRecipeByIdInstance($id) {
        $id = intval($id);
        $query = "SELECT * FROM {$this->table} WHERE recipe_id = $id";
        $result = $this->conn->query($query);

        if (!$result) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        $recipe = $result->fetch_assoc();
        if (!$recipe) {
            return ['success' => false, 'error' => 'Recipe not found'];
        }

        return ['success' => true, 'recipe' => $recipe];
    }

    public function createRecipeInstance($data) {
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} (title, description, ingredients, instructions, prep_time, cook_time, servings, image_url, user_id, cuisine, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        if (!$stmt) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        $title = $data['title'];
        $description = $data['description'];
        $ingredients = $data['ingredients'];
        $instructions = $data['instructions'];
        $prep_time = intval($data['prep_time']);
        $cook_time = intval($data['cook_time']);
        $servings = intval($data['servings']);
        $image_url = $data['image_url'];
        $user_id = intval($data['user_id']);
        $cuisine = $data['cuisine'];
        $difficulty = $data['difficulty'];

        $stmt->bind_param("ssssiiiisis", $title, $description, $ingredients, $instructions, $prep_time, $cook_time, $servings, $image_url, $user_id, $cuisine, $difficulty);

        if ($stmt->execute()) {
            $recipe_id = $this->conn->insert_id;
            $stmt->close();
            return ['success' => true, 'id' => $recipe_id];
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ['success' => false, 'error' => $error];
        }
    }

    public function updateRecipeInstance($id, $data) {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET title = ?, description = ?, ingredients = ?, instructions = ?, prep_time = ?, cook_time = ?, servings = ?, image_url = ?, cuisine = ?, difficulty = ? WHERE recipe_id = ? AND user_id = ?");

        if (!$stmt) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        $title = $data['title'];
        $description = $data['description'];
        $ingredients = $data['ingredients'];
        $instructions = $data['instructions'];
        $prep_time = intval($data['prep_time']);
        $cook_time = intval($data['cook_time']);
        $servings = intval($data['servings']);
        $image_url = $data['image_url'];
        $cuisine = $data['cuisine'];
        $difficulty = $data['difficulty'];
        $user_id = intval($data['user_id']); // Added user_id check for security

        $stmt->bind_param("ssssiiissiii", $title, $description, $ingredients, $instructions, $prep_time, $cook_time, $servings, $image_url, $cuisine, $difficulty, $id, $user_id);

        if ($stmt->execute()) {
            $stmt->close();
            return $this->getRecipeByIdInstance($id);
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ['success' => false, 'error' => $error];
        }
    }

    public function deleteRecipeInstance($id, $user_id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE recipe_id = ? AND user_id = ?");

        if (!$stmt) {
            return ['success' => false, 'error' => $this->conn->error];
        }

        $stmt->bind_param("ii", $id, $user_id);

        if ($stmt->execute()) {
            $stmt->close();
            return ['success' => true];
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ['success' => false, 'error' => $error];
        }
    }

    // Get all recipes with optional limit
    public static function getAllRecipes($database, $limit = null) {
        $conn = $database->conn;

        // Check if the is_deleted column exists in the recipes table
        $checkColumnSql = "SHOW COLUMNS FROM recipes LIKE 'is_deleted'";
        $columnResult = $conn->query($checkColumnSql);

        if ($columnResult && $columnResult->num_rows > 0) {
            // Column exists, use it in the query
            $sql = "SELECT * FROM recipes WHERE is_deleted = 0";
        } else {
            // Column doesn't exist, skip the condition
            $sql = "SELECT * FROM recipes";
        }

        if ($limit) {
            $sql .= " LIMIT " . intval($limit);
        }

        $result = $conn->query($sql);
        if (!$result) {
            // Return the error for debugging
            return false;
        }

        $recipes = $database->fetchAll($result);

        // Check if user is logged in and favorite_recipes table exists
        if (isset($_SESSION['user_id'])) {
            $checkTableSql = "SHOW TABLES LIKE 'favorite_recipes'";
            $tableResult = $conn->query($checkTableSql);

            if ($tableResult && $tableResult->num_rows > 0) {
                // Get all favorites for the current user
                $favSql = "SELECT recipe_id FROM favorite_recipes WHERE user_id = ?";
                $favStmt = $conn->prepare($favSql);
                $user_id = $_SESSION['user_id'];
                $favStmt->bind_param("i", $user_id);
                $favStmt->execute();
                $favResult = $favStmt->get_result();

                // Create an array of favorited recipe IDs
                $favoriteIds = [];
                while ($row = $favResult->fetch_assoc()) {
                    $favoriteIds[] = $row['recipe_id'];
                }

                // Update the favourite field for each recipe
                foreach ($recipes as &$recipe) {
                    $recipe['favourite'] = in_array($recipe['recipe_id'], $favoriteIds) ? 1 : 0;
                }
            }
        }

        return $recipes;
    }

    // Get recipe by ID
    public static function getRecipeById($id, $database) {
        $conn = $database->conn;

        // Check if the is_deleted column exists in the recipes table
        $checkColumnSql = "SHOW COLUMNS FROM recipes LIKE 'is_deleted'";
        $columnResult = $conn->query($checkColumnSql);

        if ($columnResult && $columnResult->num_rows > 0) {
            // Column exists, use it in the query
            $sql = "SELECT * FROM recipes WHERE recipe_id = ? AND is_deleted = 0";
        } else {
            // Column doesn't exist, skip the condition
            $sql = "SELECT * FROM recipes WHERE recipe_id = ?";
        }

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        if (!$stmt->execute()) {
            return false;
        }
        $result = $stmt->get_result();
        $recipe = $result->fetch_assoc();

        if ($recipe && isset($_SESSION['user_id'])) {
            // Check if favorite_recipes table exists
            $checkTableSql = "SHOW TABLES LIKE 'favorite_recipes'";
            $tableResult = $conn->query($checkTableSql);

            if ($tableResult && $tableResult->num_rows > 0) {
                // Check if this recipe is favorited by the current user
                $favSql = "SELECT 1 FROM favorite_recipes WHERE user_id = ? AND recipe_id = ?";
                $favStmt = $conn->prepare($favSql);
                $user_id = $_SESSION['user_id'];
                $favStmt->bind_param("ii", $user_id, $id);
                $favStmt->execute();
                $favResult = $favStmt->get_result();

                // Set favourite to 1 if the recipe is in the user's favorites, 0 otherwise
                $recipe['favourite'] = ($favResult->num_rows > 0) ? 1 : 0;
            }
        }

        return $recipe;
    }

    // Create new recipe
    public static function createRecipe($data, $database) {
        $conn = $database->conn;
        $sql = "INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty, cuisine, ingredients, instructions, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("issiiiissss",
            $data['user_id'],
            $data['title'],
            $data['description'],
            $data['prep_time'],
            $data['cook_time'],
            $data['servings'],
            $data['difficulty'],
            $data['cuisine'],
            $data['ingredients'],
            $data['instructions'],
            $data['image_url']
        );

        if (!$stmt->execute()) {
            return false;
        }
        return $stmt->insert_id;
    }

    // Update recipe
    public static function updateRecipe($id, $data, $database) {
        $conn = $database->conn;
        $sql = "UPDATE recipes SET
                title = ?,
                description = ?,
                prep_time = ?,
                cook_time = ?,
                servings = ?,
                difficulty = ?,
                cuisine = ?,
                ingredients = ?,
                instructions = ?,
                image_url = ?
                WHERE recipe_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssiiiissssi",
            $data['title'],
            $data['description'],
            $data['prep_time'],
            $data['cook_time'],
            $data['servings'],
            $data['difficulty'],
            $data['cuisine'],
            $data['ingredients'],
            $data['instructions'],
            $data['image_url'],
            $id
        );

        return $stmt->execute();
    }

    // Delete recipe (soft delete)
    public static function deleteRecipe($id, $database) {
        $conn = $database->conn;

        // Check if the is_deleted column exists in the recipes table
        $checkColumnSql = "SHOW COLUMNS FROM recipes LIKE 'is_deleted'";
        $columnResult = $conn->query($checkColumnSql);

        if ($columnResult && $columnResult->num_rows > 0) {
            // Column exists, use soft delete
            $sql = "UPDATE recipes SET is_deleted = 1 WHERE recipe_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        } else {
            // Column doesn't exist, use hard delete
            $sql = "DELETE FROM recipes WHERE recipe_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            return $stmt->execute();
        }
    }

    // Get all recipes for admin (including deleted)
    public static function getAllRecipesAdmin($database) {
        $conn = $database->conn;
        $sql = "SELECT * FROM recipes";
        $result = $conn->query($sql);
        if (!$result) {
            return false;
        }
        return $database->fetchAll($result);
    }

    // Restore deleted recipe
    public static function restoreRecipe($id, $database) {
        $conn = $database->conn;
        $sql = "UPDATE recipes SET is_deleted = 0 WHERE recipe_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Permanently delete recipe
    public static function permanentlyDeleteRecipe($id, $database) {
        $conn = $database->conn;
        $sql = "DELETE FROM recipes WHERE recipe_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Get favorite recipes
    public static function getFavoriteRecipes($user_id, $database) {
        $conn = $database->conn;
        // Check if favorite_recipes table exists
        $checkTableSql = "SHOW TABLES LIKE 'favorite_recipes'";
        $tableResult = $conn->query($checkTableSql);

        if ($tableResult && $tableResult->num_rows > 0) {
            // Use the favorite_recipes table
            $sql = "SELECT r.* FROM recipes r
                    INNER JOIN favorite_recipes f ON r.recipe_id = f.recipe_id
                    WHERE f.user_id = ?";
            if ($conn->query("SHOW COLUMNS FROM recipes LIKE 'is_deleted'")->num_rows > 0) {
                $sql .= " AND r.is_deleted = 0";
            }
        } else {
            // Fall back to using the favourite column in recipes table
            $sql = "SELECT * FROM recipes WHERE favourite = 1 AND user_id = ?";
            if ($conn->query("SHOW COLUMNS FROM recipes LIKE 'is_deleted'")->num_rows > 0) {
                $sql .= " AND is_deleted = 0";
            }
        }

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        if (!$stmt->execute()) {
            return false;
        }
        $result = $stmt->get_result();
        return $database->fetchAll($result);
    }

    // Get recently viewed recipes
    public static function getRecentlyViewed($user_id, $database) {
        $conn = $database->conn;
        $sql = "SELECT r.* FROM recipes r
                INNER JOIN recently_viewed rv ON r.recipe_id = rv.recipe_id
                WHERE rv.user_id = ? AND r.is_deleted = 0
                ORDER BY rv.viewed_at DESC
                LIMIT 10";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        if (!$stmt->execute()) {
            return false;
        }
        $result = $stmt->get_result();
        return $database->fetchAll($result);
    }

    // Add to recently viewed
    public static function addToRecentlyViewed($user_id, $recipe_id, $database) {
        $conn = $database->conn;
        // First delete any existing entry
        $sql = "DELETE FROM recently_viewed WHERE user_id = ? AND recipe_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $user_id, $recipe_id);
        $stmt->execute();

        // Then add new entry
        $sql = "INSERT INTO recently_viewed (user_id, recipe_id) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $user_id, $recipe_id);
        return $stmt->execute();
    }

    // Update favorite status
    public static function updateFavoriteStatus($recipe_id, $favourite, $database) {
        $conn = $database->conn;

        // Check if user is logged in
        if (!isset($_SESSION['user_id'])) {
            return false;
        }

        $user_id = $_SESSION['user_id'];

        // Check if favorite_recipes table exists
        $checkTableSql = "SHOW TABLES LIKE 'favorite_recipes'";
        $tableResult = $conn->query($checkTableSql);

        if ($tableResult && $tableResult->num_rows > 0) {
            // Use the favorite_recipes table (preferred method)
            if ($favourite == 1) {
                // Add to favorites if not already there
                $sql = "INSERT IGNORE INTO favorite_recipes (user_id, recipe_id) VALUES (?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ii", $user_id, $recipe_id);
                $result = $stmt->execute();
            } else {
                // Remove from favorites
                $sql = "DELETE FROM favorite_recipes WHERE user_id = ? AND recipe_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ii", $user_id, $recipe_id);
                $result = $stmt->execute();
            }
        } else {
            // Fall back to using the favourite column in recipes table
            // First, check if the favourite column exists
            $checkColumnSql = "SHOW COLUMNS FROM recipes LIKE 'favourite'";
            $columnResult = $conn->query($checkColumnSql);

            if ($columnResult && $columnResult->num_rows == 0) {
                // Column doesn't exist, add it
                $addColumnSql = "ALTER TABLE recipes ADD COLUMN favourite TINYINT(1) DEFAULT 0";
                $conn->query($addColumnSql);
            }

            // Update the favourite status for this specific recipe and user
            // This is not ideal but maintains backward compatibility
            $sql = "UPDATE recipes SET favourite = ? WHERE recipe_id = ? AND user_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("iii", $favourite, $recipe_id, $user_id);
            $result = $stmt->execute();
        }

        return $result;
    }
}
?>