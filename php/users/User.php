<?php
class User
{
  public static function register($username, $email, $password, $conn)
  {
    $password = password_hash($password, PASSWORD_DEFAULT); //encruypt usng bcrypt in practical
    $query = 'SELECT user_id FROM users where email=?';
    $sql = $conn->prepare($query);
    if ($sql === false) {
      die("Error preparing query: " . $conn->error);
    }
    $sql->bind_param("s", $email);
    $sql->execute();
    $duplicatedEmail = $sql->get_result();
    if ($duplicatedEmail->num_rows > 0) {
      return false;
    }

    $sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
      die("Error preparing query: " . $conn->error);
    }
    $stmt->bind_param("sss", $username, $email, $password);
    if (!$stmt->execute()) {
      die("Query Error:" . mysqli_error($conn));
    }
    return true;
  }

  public static function login($email, $password, $conn)
  {
    $sql = "SELECT user_id, username, email, role, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    if (!$stmt) {
      die("Prepare error" . $conn->error);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
      return false;   //if no user found return false
    }
    $user = $result->fetch_assoc();

    if (password_verify($password, $user["password"])) {
      unset($user['password']);   //remove the password part then return to user
      return $user;
    }
    return false;
  }

  //return all recipe of user
  public static function getAllRecipes($user_id, $conn)
  {
    $sql = "SELECT recipe_id, title FROM recipes WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    if (!$stmt) {
      die("Prepare error" . $conn->error);
    }
    $result = $stmt->get_result();
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    if ($result->num_rows == 0) {
      return false;   //if no user found return false
    }
    return $result->fetch_assoc();
  }

  public static function checkRole($user_id, $conn)
  {
    $sql = "SELECT role from Users WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    return $result['role'] === 'admin';
  }

  public static function createPasswordResetToken($email, $conn)
  {
    // Check if email exists in users table
    $sql = "SELECT user_id FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      return false;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
      return false;
    }

    // Generate token
    $token = bin2hex(random_bytes(32));
    
    // Delete any existing tokens for this email
    $sql = "DELETE FROM password_resets WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      return false;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    // Insert new token
    $sql = "INSERT INTO password_resets (email, token) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      return false;
    }
    
    $stmt->bind_param("ss", $email, $token);
    if (!$stmt->execute()) {
      return false;
    }
    
    return [
      'email' => $email,
      'token' => $token
    ];
  }

  public static function resetPassword($email, $token, $password, $conn)
  {
    $sql = "SELECT * FROM password_resets WHERE email = ? AND token = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      return false;
    }
    
    $stmt->bind_param("ss", $email, $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
      return false;
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "UPDATE users SET password = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      return false;
    }
    
    $stmt->bind_param("ss", $hashedPassword, $email);
    if (!$stmt->execute()) {
      return false;
    }
    
    // Delete used token
    $sql = "DELETE FROM password_resets WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      return false;
    }
    
    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
      return false;
    }
    
    return true;
  }
}
