<?php

class Votes
{
  public static function voteRecipe($entry_id, $user_id, $conn)//in api check first if user voted this recipe, if not then vote(run this function)
  {
    $sql = "INSERT INTO votes (entry_id, user_id) VALUES (?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $entry_id, $user_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  //once render specific competition, check did user vote any recipes in this competition
  public static function checkUserVoteAll($user_id, $conn, $competition_id)
  {
    $sql = "SELECT ce.entry_id
            FROM votes v
            JOIN competition_entries ce ON v.entry_id = ce.entry_id
            JOIN competitions c ON ce.competition_id = c.competition_id
            WHERE v.user_id = ?
            AND ce.competition_id = ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $competition_id);
    if (!$stmt->execute()) {
      die("Query error: " . $stmt->error);
    }
    $result = $stmt->get_result();
    $entries = [];
    while ($row = $result->fetch_assoc()) {
      $entries[] = $row['entry_id'];
    }
    return $entries; // returns an array of entry_id values
  }


  public static function checkHasUserVotedSameEntry($user_id, $conn, $entry_id)
  {
    $sql = "SELECT vote_id FROM votes WHERE user_id = ? AND entry_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("ii", $user_id, $entry_id);
    if (!$stmt->execute()) {
      die("Execute failed: " . $stmt->error);
    }
    $result = $stmt->get_result();
    return $result->num_rows > 0;
  }


  public static function getVotes($recipe_id, $competition_id, $conn)
  {
    $sql = "SELECT COUNT(*) FROM votes WHERE recipe_id = $recipe_id AND competition_id = $competition_id";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    return $result;
  }

  public static function getMostVotedRecipe($competition_id, $conn)
  {
    $sql = "SELECT ce.entry_id, r.recipe_id, r.title AS recipe_title, COUNT(v.vote_id) AS total_votes
            FROM votes v
            JOIN competition_entries ce ON v.entry_id = ce.entry_id 
            JOIN recipes r ON r.recipe_id = ce.recipe_id
            JOIN competitions c ON c.competition_id = ce.competition_id
            WHERE ce.competition_id = ? AND ce.is_deleted = 0
            GROUP BY ce.entry_id 
            ORDER BY total_votes DESC, ce.submission_date ASC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $competition_id);
    $result = $stmt->execute();
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();
    return $result;
  }
}
