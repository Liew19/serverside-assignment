<?php
require_once 'D:\php2\htdocs\server\php\database\database.php';
class User
{
  public static function register($username, $email, $password, $database)
  {
    $password = password_hash($password, PASSWORD_DEFAULT); //encruypt usng bcrypt in practical
    $query = 'SELECT user_id FROM users where email="$email"';
    $duplicatedEmail = $database->query($query);
    if (mysqli_num_rows($duplicatedEmail) > 0) {
      return false;
    }

    $sql = "INSERT INTO users (username, email, password, role) VALUES ('$username', '$email', '$password', 'user')";
    $result = $database->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($database->conn));
    }
    return true;    //return user id
  }

  public static function login($email, $password, $database)
  {
    $sql = "SELECT user_id, username, email, role, password FROM users WHERE email = '$email'";
    $result = $database->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($database->conn));
    }
    if (mysqli_num_rows($result) == 0) {
      return false;   //if no user found return false
    }
    $user = mysqli_fetch_assoc($result);

    if (password_verify($password, $user["password"])) {
      unset($user['password']);
      return $user;
    }
    return false;
  }

  public static function getAllRecipes($user_id, $database)
  {
    $sql = "SELECT recipe_id, title FROM recipes WHERE user_id = $user_id";
    $result = $database->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($database->conn));
    }
    if (mysqli_num_rows($result) == 0) {
      return false;   //if no user found return false
    }
    return $database->fetchAll($result);
  }

  public static function checkRole($user_id, $database)
  {
    $sql = "SELECT role from Users WHERE user_id = '$user_id'";
    $result = $database->query($sql);
    $result = mysqli_fetch_assoc($result);
    return $result['role'] === 'admin';
  }
}
