<?php
require_once '../../database.php';
class Competition
{
  private static function validateAndFormatDate($date)
  {
    $timestamp = strtotime($date);
    return $timestamp ? date('Y-m-d', $timestamp) : false;
  }
  public static function createCompetition($title, $description, $start_date, $end_date, $voting_end_date, $prize, $database)
  {
    $conn = $database->conn;

    $start_date = date('Y-m-d', strtotime($start_date));
    $end_date = date('Y-m-d', strtotime($end_date));
    $voting_end_date = date('Y-m-d', strtotime($voting_end_date));
    if (!$start_date || !$end_date || !$voting_end_date) {
      die("Invalid date format.");
    }

    $today = date('Y-m-d');
    if ($end_date < $today) {
      die("Query Error: cannot add ended competition" . mysqli_error($conn));
    }
    $active = ($today >= $start_date && $today <= $end_date) ? 'active' : 'upcoming';

    $sql = "INSERT INTO competitions (title, description, start_date, end_date, voting_end_date, status, prize) VALUES ('$title', '$description', '$start_date', '$end_date', '$voting_end_date', '$active', '$prize')";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    return $conn->insert_id;
  }

  public static function getAllCompetitionsActive($database)
  {
    $conn = $database->conn;
    $sql = "SELECT * FROM competitions WHERE status='active'";

    $result = $conn->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }

  public static function getCompetitionActiveStatus($competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "SELECT active FROM competitions WHERE competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }

  public static function getEntriesNum($competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "SELECT COUNT(entry_id) AS num FROM competition_entries WHERE competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query Error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }

  public static function setCompetitionToInactive($competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "UPDATE competitions SET status = 'past' WHERE competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    return $result;
  }

  public static function getCompetitionById($id, $database)   //safe to delete, only in postman no usage in website
  {
    //return competition_id, title, description, status, start_date, end_date, entry_num and prize 
    $conn = $database->conn;
    $sql = "SELECT competition_id, title, description, status, start_date, end_date, prize, voting_end_date FROM competitions WHERE competition_id = $id";
    $entryNum = Competition::getEntriesNum($id, $database);
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    $result = mysqli_fetch_assoc($result);
    $result['entry_num'] = $entryNum[0]['num']; //return as array of objects, so need to 0 then 'num'
    return $result;
  }
  //delete competition
  public static function deleteCompetition($id, $database)
  {
    $conn = $database->conn;
    $sql = "UPDATE competitions SET status = 'deleted' WHERE competition_id = $id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  //update competition all details
  public static function updateCompetition($id, $title, $description, $start_date, $end_date, $voting_end_date, $database)
  {
    $conn = $database->conn;
    $sql = "UPDATE competitions SET title = '$title', description = '$description', start_date = '$start_date', end_date = '$end_date', voting_end_date = '$voting_end_date' WHERE competition_id = $id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result; //if true return 1, api will return 200
  }

  //get all competitions with pagination
  public static function getAllCompetitions($page, $perPage, $database, $status)    //in api call, set total page by sql count 
  {
    $conn = $database->conn;
    $sql = "SELECT competition_id, title, description, status, prize, start_date, end_date, voting_end_date FROM competitions";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }

  //check if submission is repeated
  public static function checkRecipeSubmission($recipe_id, $competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "SELECT entry_id FROM competition_entries WHERE recipe_id = $recipe_id AND competition_id = $competition_id";
    $result = $conn->query($sql);
    if (mysqli_num_rows($result) > 0) {
      return true;
    }
  }
  public static function enterRecipe($competition_id, $recipe_id, $database)
  {
    $conn = $database->conn;

    $competition = self::getCompetitionById($competition_id, $database);
    if (!$competition || $competition['status'] == 0) {
      return false;   //no competition found or not active
    }

    $sql = "INSERT INTO competition_entries (competition_id, recipe_id) VALUES ($competition_id, $recipe_id)";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  public static function getCompetitionRecipes($competition_id, $database)
  { //before showing details 
    //get all recipes in a competition
    //return entry_id, title, description, username, submission_date and number of votes
    $conn = $database->conn;
    $sql = "SELECT 
    ce.entry_id, 
    r.title AS recipe_title, 
    r.description AS recipe_description, 
    u.username, 
    ce.submission_date, 
    COUNT(v.vote_id) AS number_of_votes
    FROM 
        competition_entries ce
    JOIN 
        recipes r ON ce.recipe_id = r.recipe_id
    JOIN 
        users u ON r.user_id = u.user_id
    LEFT JOIN 
        votes v ON v.entry_id = ce.entry_id
    WHERE 
        ce.competition_id = $competition_id
        AND ce.is_deleted = 0 
    GROUP BY 
        ce.entry_id
    ORDER BY 
      ce.submission_date DESC;";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }
  public static function markCompetitionStatus($competition_id, $database, $status)
  {
    $conn = $database->conn;
    $today = date('Y-m-d');
    $sql = "UPDATE competitions SET status = '$status', end_date = '$today', voting_end_date = '$today' WHERE competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  //user choose to delete submission
  public static function deleteCompetitionEntry($entry_id, $database, $delete_desc)
  {
    $conn = $database->conn;
    $sql = "UPDATE competition_entries SET is_deleted = 1, delete_description = '$delete_desc' WHERE entry_id = $entry_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }
  public static function setCompetitionWinner($competition_id, $database)
  {
    $conn = $database->conn;
    $winnerCompEntryId = Votes::getMostVotedRecipe($competition_id, $database);
    $sql = "UPDATE competitions SET winner_entry_id = " . $winnerCompEntryId[0]['entry_id'] . ", status='past' WHERE competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  public static function getCompetitionWinner($competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "SELECT 
        ce.entry_id,
        r.title,
        COUNT(v.vote_id) AS number_of_votes
        FROM 
            competitions c
        JOIN 
            competition_entries ce ON c.competition_id = ce.competition_id
        JOIN 
            recipes r ON ce.recipe_id = r.recipe_id
        LEFT JOIN 
            votes v ON v.entry_id = ce.entry_id
        WHERE 
            c.competition_id = '$competition_id' 
            AND ce.entry_id = c.winner_entry_id 
        GROUP BY 
            ce.entry_id, r.title";
    $result = $conn->query($sql);
    if (!$result) {
      die("query error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }
}
