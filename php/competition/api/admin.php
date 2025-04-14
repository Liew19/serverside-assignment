<?php
require_once '../models/Votes.php';
require_once '../../database/database.php';
require_once '../models/Competition.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Specific origin for React app
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma"); // Allowed headers
header("Access-Control-Allow-Credentials: true"); // Allow credentials (cookies, authorization headers, etc.)
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");

session_start();
$database = new Database("localhost", "root", "password");
$conn = $database->conn;

$headers = getallheaders();

// if (!isset($_SESSION['user_id'])) {
//   http_response_code(401);
//   echo json_encode(['message' => 'user not authenticated']);
//   exit();
// }
// if ($_SESSION['role'] != 'admin') {
//   http_response_code(401);
//   echo json_encode(['message' => 'Not admin user, access denied']);
//   exit();
// }

//Create Competition by admin 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_competition') {
  $name = $_POST['title'];
  $description = $_POST['description'];
  $start_date = $_POST['start_date'];
  $end_date = $_POST['end_date'];
  $voting_end_date = $_POST['voting_end_date'];
  $prize = $_POST['prize'];

  $name = $conn->real_escape_string($name);
  $description = $conn->real_escape_string($description);
  $start_date = $conn->real_escape_string($start_date);
  $end_date = $conn->real_escape_string($end_date);
  $voting_end_date = $conn->real_escape_string($voting_end_date);
  $prize = $conn->real_escape_string($prize);

  $result = Competition::createCompetition($name, $description, $start_date, $end_date, $voting_end_date, $prize, $database);
  if ($result) {
    http_response_code(201);
    echo json_encode(['message' => 'Competition created successfully', 'competition_id' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to create competition']);
  }
}

//update competition by admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_competition') {
  $competition_id = $_POST['competition_id'];
  $title = $_POST['title'];
  $description = $_POST['description'];
  $start_date = $_POST['start_date'];
  $end_date = $_POST['end_date'];
  $voting_end_date = $_POST['voting_end_date'];
  $prize = $_POST['prize'];

  $title = $conn->real_escape_string($title);
  $description = $conn->real_escape_string($description);
  $start_date = $conn->real_escape_string($start_date);
  $end_date = $conn->real_escape_string($end_date);
  $voting_end_date = $conn->real_escape_string($voting_end_date);
  $prize = $conn->real_escape_string($prize);

  $result = Competition::updateCompetition($competition_id, $title, $description, $start_date, $end_date, $voting_end_date, $prize, $database);
  if ($result) {
    http_response_code(200);
    echo json_encode(['status' => true]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to update competition']);
  }
}

//mark competition as ended by admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'mark_competition_ended') {
  $competition_id = $_POST['competition_id'];
  if (isset($_POST['status'])) {
    $status = $_POST['status'];
    if (!($status == 'active' || $status == 'past' || $status == 'upcoming')) {
      http_response_code(500);
      echo json_encode(['message' => 'Status must be active or past or upcoming']);
      exit();
    }
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Status not provided']);
    exit();
  }
  $result = Competition::markCompetitionStatus($competition_id, $database, $status);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Competition marked as ' . $status . ' successfully']);
  } else {
    http_response_code(400);
    echo json_encode(['message' => 'Failed to mark competition as ended']);
  }
}

// //delete competition by admin
// if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_competition') {
//   $competition_id = $_POST['competition_id'];
//   $result = Competition::deleteCompetition($competition_id, $database);
//   if ($result) {
//     http_response_code(200);
//     echo json_encode(['message' => 'Competition deleted successfully']);
//   } else {
//     http_response_code(500);
//     echo json_encode(['message' => 'Failed to delete competition']);
//   }
// }

//delete competition entry by admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_competition_entry') {
  $entry_id = $_POST['entry_id'];
  $delete_desc = $_POST['delete_desc'];
  $result = Competition::deleteCompetitionEntry($entry_id, $database, $delete_desc);
  if ($result) {
    http_response_code(200);
    echo json_encode([
      'status' => true
    ]);
  } else {
    http_response_code(400);
    echo json_encode([
      'status' => false
    ]);
  }
}

//get most voted entry by admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'get_most_voted_entry') {
  $competition_id = $_POST['competition_id'];
  $result = Votes::getMostVotedRecipe($competition_id, $database);
  echo json_encode([
    'Most voted entry' => $result[0]['entry_id'],
    'Most voted recipe' => $result[0]['recipe_id'],
    'Most voted recipe name' => $result[0]['recipe_title'],
    'Total Votes' => $result[0]['total_votes']
  ]);
}

//set competition winner by admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'set_competition_winner') {
  $competition_id = $_POST['competition_id'];
  $result = Competition::setCompetitionWinner($competition_id, $database);

  if ($result) {
    Competition::markCompetitionStatus($competition_id, $database, 'past');
    http_response_code(200);
    echo json_encode(['message' => 'Competition winner set successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to set competition winner']);
  }
}
