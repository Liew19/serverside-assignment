<?php
class MealPlanning
{
    private $conn;
    private $table = 'meal_planning';

    public function __construct() {
        $this->conn = new mysqli("localhost", "root", "", "recipe_database");
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    // Get all meals for a specific month and year for a user
    public static function getMealsForMonth($user_id, $year, $month, $database){
        // Format month to ensure it's two digits
        $month = str_pad($month, 2, '0', STR_PAD_LEFT);
        
        $start_date = "$year-$month-01";
        $end_date = date('Y-m-t', strtotime($start_date));
        
        $sql = "SELECT 
                    mp.meal_id AS id, 
                    mp.name, 
                    mp.type, 
                    mp.is_custom AS isCustom, 
                    mp.recipe_id AS recipeId, 
                    DATE_FORMAT(mp.meal_date, '%Y-%m-%d') AS date 
                FROM 
                    meal_planning mp 
                WHERE 
                    mp.user_id = ? AND 
                    mp.meal_date BETWEEN ? AND ?";
        
        $stmt = $database->prepare($sql);

        if (!$stmt) {
            error_log("Prepare failed: " . $database->error);
            return [];
        }
        
        $stmt->bind_param("iss", $user_id, $start_date, $end_date);
        
        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            $stmt->close();
            return [];
        }
        
        $result = $stmt->get_result();
        $meals = [];
        
        while ($row = $result->fetch_assoc()) {
            $meals[] = $row;
        }
        
        $stmt->close();
        return $meals;
    }
    
    public static function getMealsForDay($user_id, $date, $database)
    {
        $sql = "SELECT 
                    mp.meal_id AS id, 
                    mp.name, 
                    mp.type, 
                    mp.is_custom AS isCustom, 
                    mp.recipe_id AS recipeId, 
                    DATE_FORMAT(mp.meal_date, '%Y-%m-%d') AS date 
                FROM 
                    meal_planning mp 
                WHERE 
                    mp.user_id = $user_id AND 
                    mp.meal_date = '$date'";
        
        $result = $database->query($sql);
        
        return $database->fetchAll($result);
    }
    
    public static function addMeal($user_id, $name, $type, $is_custom, $recipe_id, $date, $database)
    {
        $stmt = $database->prepare("INSERT INTO meal_planning 
            (user_id, name, type, is_custom, recipe_id, meal_date) 
            VALUES (?, ?, ?, ?, ?, ?)");
    
        if (!$stmt) {
            error_log("Prepare failed: " . $database->error);
            return false;
        }
    
        // If recipe_id is NULL, use NULL binding
        if ($recipe_id === null) {
            $stmt->bind_param("ississ", $user_id, $name, $type, $is_custom, $recipe_id, $date);
        } else {
            $recipe_id = (int)$recipe_id;
            $stmt->bind_param("ississ", $user_id, $name, $type, $is_custom, $recipe_id, $date);
        }
    
        if ($stmt->execute()) {
            $new_meal_id = $stmt->insert_id;
            $stmt->close();
    
            return self::getMealById($new_meal_id, $database);
        } else {
            error_log("Execute failed: " . $stmt->error);
            $stmt->close();
            return false;
        }
    }
    
    public static function updateMeal($meal_id, $name, $type, $is_custom, $recipe_id, $database)
    {
        $stmt = $database->prepare(
            "UPDATE meal_planning 
            SET 
                name = ?, 
                type = ?, 
                is_custom = ?, 
                recipe_id = ?
            WHERE 
                meal_id = ?
            "
        );

        if (!$stmt) {
            error_log("Prepare failed: " . $database->error);
            return false;
        }

        $is_custom = $is_custom ? 1 : 0;
        
        if ($recipe_id === null) {
            $null = null;
            $stmt->bind_param("ssiis", $name, $type, $is_custom, $null, $meal_id);
        } else {
            $recipe_id = (int)$recipe_id;
            $stmt->bind_param("ssiis", $name, $type, $is_custom, $recipe_id, $meal_id);
        }
        
        $result = $stmt->execute();

        if (!$result) {
            error_log("Execute failed: " . $stmt->error);
            $stmt->close();
            return false;
        }
        
        $affected_rows = $stmt->affected_rows;
        $stmt->close();
        
        return $affected_rows >= 0;
    }
    
    public static function deleteMeal($meal_id, $user_id, $database) {
        
        $stmt = $database->prepare("DELETE FROM meal_planning WHERE meal_id = ? AND user_id = ?");
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param("ii", $meal_id, $user_id);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    public static function getMealById($meal_id, $database)
    {
        $meal_id = (int)$meal_id;
        
        $sql = "SELECT 
                    meal_id AS id, 
                    user_id,
                    name, 
                    type, 
                    is_custom AS isCustom, 
                    recipe_id AS recipeId, 
                    DATE_FORMAT(meal_date, '%Y-%m-%d') AS date 
                FROM 
                    meal_planning 
                WHERE 
                    meal_id = $meal_id";
        
        $result = $database->query($sql);
        
        if (mysqli_num_rows($result) > 0) {
            return mysqli_fetch_assoc($result);
        }
        
        return false;
    }
}
?>