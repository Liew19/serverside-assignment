<?php
require_once '../models/Votes.php';
require_once '../models/Competition.php';
require_once '../../users/User.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Cache-Control, Pragma");


session_start();
$conn = new mysqli("localhost", "root", "password", "database_test2");


if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['status' => 'No session']);
  exit();
}
if (!isset($_COOKIE['user_id'])) {
  http_response_code(401);
  echo json_encode(['status' => false]);
  exit();
}
if ($_COOKIE['user_id'] != $_SESSION['user_id']) {   //if session part exists cannot test with postman, close if want to debug
  // session_destroy();
  // setcookie('user_id', '');
  http_response_code(401);
  echo json_encode(['status' => "fake cookie"]);
  exit();
}

//send to front-end admin status by fetching in useEffect
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'check_status') {
  $userID = $_COOKIE['user_id'];
  $admin = User::checkRole($userID, $conn);   //admin boolean, if return true is admin, check user admin status in backend to prevent impersonating, return to front-end as props to render admin-only components
  if ($admin) {
    http_response_code(200);
    echo json_encode(["status" => true, "admin" => true]);  //for front end usage
  } else {
    http_response_code(200);
    echo json_encode(["status" => true, "admin" => false]);
  }
}

//get all competitions, render in competition main page
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_all_competitions') {
  $result = Competition::getAllCompetitions($conn);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Competitions fetched successfully', 'data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch competitions']);
  }
}

//get number of entries in competition(show number of entries in competition/[id] page)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_entries') {
  $competition_id = $_GET['competition_id'];
  $result = Competition::getEntriesNum($competition_id, $conn);
  if ($result) {
    http_response_code(200);
    echo json_encode(['num_entries' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch competition entries']);
  }
}

//Get competition by id, when click on specific competition card with competition id  //done
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_competition_by_id') {
  $id = $_GET['competition_id'];  //in React card created with {key: competition_id}
  $result = Competition::getCompetitionById($id, $conn);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Competition fetched successfully', 'data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch competition']);
  }
}

//After click on specific competition card, show all recipes in that competition //done
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_competition_recipes') {
  $competition_id = $_GET['competition_id'];
  $result = Competition::getCompetitionRecipes($competition_id, $conn);
  http_response_code(200);
  echo json_encode(['message' => 'Competition recipes fetched successfully', 'status' => true, 'data' => $result]);

}

//user can vote for their favorite recipe //done
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'vote_recipe') {
  $entry_id = $_POST['entry_id'];
  $user_id = $_POST['user_id'];
  $voted = Votes::checkHasUserVotedSameEntry($user_id, $conn, $entry_id);
  if ($voted) {
    http_response_code(400);
    echo json_encode([
      'message' => 'User has already voted for the same entry before'
    ]);
    exit();
  }
  $result = Votes::voteRecipe($entry_id, $user_id, $conn);
  if ($result) {
    http_response_code(200);
    echo json_encode([
      'message' => 'Voted successfully'
    ]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to vote recipe']);
  }
}

//After user voted for a recipe, show all votes for that recipe
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_recipe_votes') {
  $recipe_id = $_GET['recipe_id'];
  $competition_id = $_GET['competition_id'];
  $result = Votes::getVotes($recipe_id, $competition_id, $conn);
  if ($result) {
    http_response_code(200);
    echo json_encode(['message' => 'Recipe votes fetched successfully', 'data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch recipe votes']);
  }
}

//get user vote history(what has user voted) //done
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_user_voted_entries') {
  $competition = $_GET['competition_id'];
  $user_id = $_GET['user_id'];
  $result = Votes::checkUserVoteAll($user_id, $conn, $competition);
  if (count($result) == 0) {
    http_response_code(200);
    echo json_encode(['message' => "user has not voted yet"]);
    exit();
  }
  if ($result) {
    http_response_code(200);
    echo json_encode(['data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch recipe votes']);
  }
}

//get user all recipes //done //needed when user submit entry
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_user_recipe') {
  $user_id = $_GET['user_id'];
  $result = User::getAllRecipes($user_id, $conn);
  if ($result) {
    http_response_code(200);
    echo json_encode(['data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to submit recipe']);
  }
}

//Submit recipe to a competition
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit_recipe') {
  $competition_id = $_POST['competition_id'];
  $recipe_id = $_POST['recipe_id'];
  $checkRepeatedSubmission = Competition::checkRecipeSubmission($recipe_id, $competition_id, $conn);
  if ($checkRepeatedSubmission == 'ineligible') {
    http_response_code(500);
    echo json_encode(['message' => 'You are ineligible to submit this recipe']);
    exit();
  }
  if ($checkRepeatedSubmission) {
    http_response_code(500);
    echo json_encode(['message' => 'Repeated submission']);
    exit();
  }
  $result = Competition::enterRecipe($competition_id, $recipe_id, $conn);
  if ($result) {
    http_response_code(201);
    echo json_encode(['message' => 'Recipe submitted successfully']);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to submit recipe']);
  }
}

//get competition winner, api path for getting winner for past competition
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_winner') {
  $competition_id = $_GET['competition_id'];
  $result = Competition::getCompetitionWinner($competition_id, $conn);
  if ($result) {
    http_response_code(200);
    echo json_encode(['data' => $result]);
  } else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to submit recipe']);
  }
}


