<?php
require_once '../../database.php';

class Votes
{
  public static function voteRecipe($entry_id, $user_id, $database)//in api check first if user voted this recipe, if not then vote(run this function)
  {
    $conn = $database->conn;
    $sql = "INSERT INTO votes (entry_id, user_id) VALUES ($entry_id, $user_id)";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  //once render specific competition, check did user vote any recipes in this competition
  public static function checkUserVoteAll($user_id, $database, $competition_id)
  {    //when click into competition check did user vote any recipes in this competition
    $conn = $database->conn;
    $sql = "SELECT ce.entry_id
      FROM votes v
      JOIN competition_entries ce ON v.entry_id = ce.entry_id
      JOIN competitions c ON ce.competition_id = c.competition_id
      WHERE v.user_id = $user_id
      AND ce.competition_id = $competition_id;";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }

  public static function checkHasUserVotedSameEntry($user_id, $database, $entry_id)
  {
    $conn = $database->conn;
    $sql = "SELECT vote_id FROM votes WHERE user_id = $user_id AND entry_id = $entry_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query Error" . mysqli_error($conn));
    }
    if (mysqli_num_rows($result) > 0) {
      return true;
    } else {
      return false;
    }
  }

  public static function removeVote($recipe_id, $user_id, $database, $competition_id)
  {
    $compStatus = Competition::getCompetitionActiveStatus($competition_id, $database);
    if ($compStatus[0]['active'] == 0) {    //cannot remove vote from inactive competition
      return false;
    }
    $conn = $database->conn;
    $sql = "DELETE FROM votes WHERE recipe_id = $recipe_id AND user_id = $user_id AND competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $result;
  }

  public static function getVotes($recipe_id, $competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "SELECT COUNT(*) FROM votes WHERE recipe_id = $recipe_id AND competition_id = $competition_id";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }

  public static function getMostVotedRecipe($competition_id, $database)
  {
    $conn = $database->conn;
    $sql = "SELECT ce.entry_id, r.recipe_id, r.title AS recipe_title, COUNT(v.vote_id) AS total_votes
    FROM votes v
    JOIN competition_entries ce ON v.entry_id = ce.entry_id JOIN recipes r ON r.recipe_id = ce.recipe_id
    JOIN competitions c ON c.competition_id = ce.competition_id
    WHERE ce.competition_id = $competition_id
    GROUP BY ce.entry_id ORDER BY total_votes DESC LIMIT 1";
    $result = $conn->query($sql);
    if (!$result) {
      die("Query error" . mysqli_error($conn));
    }
    return $database->fetchAll($result);
  }
}
