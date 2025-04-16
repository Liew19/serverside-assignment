<?php
class Competition
{
  private static function validateAndFormatDate($date)
  {
    $timestamp = strtotime($date);
    return $timestamp ? date('Y-m-d', $timestamp) : false;
  }
  public static function createCompetition($title, $description, $start_date, $end_date, $voting_end_date, $prize, $conn)
  {
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

    $sql = "INSERT INTO competitions (title, description, start_date, end_date, voting_end_date, status, prize) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $title, $description, $start_date, $end_date, $voting_end_date, $active, $prize);
    $result = $stmt->execute();
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    return true;
  }

  public static function getAllCompetitionsActive($conn)
  {
    $sql = "SELECT * FROM competitions WHERE status='active'";

    $result = mysqli_query($conn, $sql);
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    $active = [];
    while ($row = $result->fetch_assoc()) {
      $active[] = $row;
    }
    return $active;
  }

  public static function getCompetitionActiveStatus($competition_id, $conn)
  {
    $sql = "SELECT active FROM competitions WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query Error:" . mysqli_error($conn));
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    return $result;
  }

  public static function getEntriesNum($competition_id, $conn)
  {
    $sql = "SELECT COUNT(entry_id) AS num FROM competition_entries WHERE competition_id = ? AND is_deleted=0";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query Error" . mysqli_error($conn));
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    return $result;
  }

  public static function setCompetitionToInactive($competition_id, $conn)
  {
    $sql = "UPDATE competitions SET status = 'past' WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query Error" . mysqli_error($conn));
    }
    return true;
  }

  public static function getCompetitionById($competition_id, $conn)
  {
    //return competition_id, title, description, status, start_date, end_date, entry_num and prize 
    $sql = "SELECT competition_id, title, description, status, start_date, end_date, prize, voting_end_date FROM competitions WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    $data = mysqli_fetch_assoc($result);

    // Get entry number
    $entryNum = Competition::getEntriesNum($competition_id, $conn);
    $data['entry_num'] = $entryNum['num']; //return as array of objects, so need to 0 then 'num'

    return $data;
  }

  //delete competition
  public static function deleteCompetition($id, $conn)
  {
    $sql = "UPDATE competitions SET status = 'deleted' WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  //update competition all details
  public static function updateCompetition($id, $title, $description, $start_date, $end_date, $voting_end_date, $prize, $conn)
  {
    $sql = "UPDATE competitions SET title = ?, description = ?, start_date = ?, end_date = ?, prize = ?, voting_end_date = ? WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $title, $description, $start_date, $end_date, $prize, $voting_end_date, $id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result; //if true return 1, api will return 200
  }

  //get all competitions with pagination
  public static function getAllCompetitions($conn)
  {
    $sql = "SELECT competition_id, title, description, status, prize, start_date, end_date, voting_end_date FROM competitions";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result) {
      die("Query error: " . mysqli_error($conn));
    }
    $competitions = [];
    while ($row = $result->fetch_assoc()) {
      $competitions[] = $row;
    }
    return $competitions;
  }


  //check if submission is repeated
  public static function checkRecipeSubmission($recipe_id, $competition_id, $conn)
  {
    $sql = "SELECT entry_id, is_deleted FROM competition_entries WHERE recipe_id = ? AND competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $recipe_id, $competition_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (mysqli_num_rows($result) > 0) {
      $data = mysqli_fetch_assoc($result);
      if ($data['is_deleted'] == 1) {
        return "ineligible";  //notify user entry has been deleted before, so cannot resubmit
      } else {
        return true;
      }
    }
    return false;
  }

  public static function enterRecipe($competition_id, $recipe_id, $conn)
  {
    $competition = self::getCompetitionById($competition_id, $conn);
    if (!$competition || $competition['status'] == 0) {
      return false;   //no competition found or not active
    }

    $sql = "INSERT INTO competition_entries (competition_id, recipe_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $competition_id, $recipe_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  public static function getCompetitionRecipes($competition_id, $conn)
  {
    //get all recipes in a competition
    //return entry_id, title, description, username, submission_date, and number of votes
    $sql = "SELECT 
    ce.entry_id, 
    ce.recipe_id,  -- Added the recipe_id column here
    r.title AS recipe_title, 
    r.description AS recipe_description, 
    u.username, 
    ce.submission_date, 
    COUNT(v.vote_id) AS number_of_votes
    FROM 
        competition_entries ce
    JOIN recipes r ON ce.recipe_id = r.recipe_id
    JOIN users u ON r.user_id = u.user_id
    LEFT JOIN votes v ON v.entry_id = ce.entry_id
    WHERE 
        ce.competition_id = ?
        AND ce.is_deleted = 0 
    GROUP BY 
        ce.entry_id
    ORDER BY 
        ce.submission_date DESC;
    ;";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Failed to prepare statement: " . mysqli_error($conn));
    }
    $stmt->bind_param("i", $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query execution failed: " . mysqli_error($conn));
    }
    $result = $stmt->get_result();
    $recipes = [];
    while ($row = $result->fetch_assoc()) {
      $recipes[] = $row;
    }
    return $recipes;
  }


  public static function markCompetitionStatus($competition_id, $conn, $status)
  {
    $today = date('Y-m-d');
    $sql = "UPDATE competitions SET status = ?, end_date = ?, voting_end_date = ? WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $status, $today, $today, $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  //user choose to delete submission
  public static function deleteCompetitionEntry($entry_id, $conn, $delete_desc)
  {
    $sql = "UPDATE competition_entries SET is_deleted = 1, delete_description = ? WHERE entry_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $delete_desc, $entry_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  public static function setCompetitionWinner($competition_id, $conn)
  {
    $winnerCompEntryId = Votes::getMostVotedRecipe($competition_id, $conn);
    $sql = "UPDATE competitions SET winner_entry_id = ?, status='past' WHERE competition_id = ?";
    $stmt = $conn->prepare($sql);
    $winnerEntryId = $winnerCompEntryId['entry_id'];
    $stmt->bind_param("ii", $winnerEntryId, $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  public static function getCompetitionWinner($competition_id, $conn)
  {
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
            c.competition_id = ? 
            AND ce.entry_id = c.winner_entry_id 
        GROUP BY 
            ce.entry_id, r.title";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result) {
      die("query error" . mysqli_error($conn));
    }
    $winner = [];
    while ($row = $result->fetch_assoc()) {
      $winner[] = $row;
    }
    return $winner;
  }
}
