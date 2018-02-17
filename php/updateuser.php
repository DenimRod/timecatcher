<?php
include 'ri_config.php';
  // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}
  //Get params
$jsonString = $_GET['jsonString'];
  //Json String -> PHP Array
$jsonArray = json_decode($jsonString,true);

  // ? = Parameter, werden danach mit Werten befüllt
if ($stmt = $conn->prepare('UPDATE Users SET status = ?, lastcomment = ?, worktimeToday = ?, lasttimestamp = ?, lasttimestampISO = ? WHERE id = ?')) {

    /* bind parameters to values */
    $stmt->bind_param("sssssi", $jsonArray['status'], $jsonArray['lastcomment'],$jsonArray['worktimeToday'], $jsonArray['lasttimestamp'], $jsonArray['lasttimestampISO'], $jsonArray['id']);

    /* execute query */
    $stmt->execute();
    /* close statement */
    $stmt->close();
}

$conn->close();
?>
