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
echo ($jsonString);
echo ($jsonArray['username']);

  // ? = Parameter, werden danach mit Werten befüllt
if ($stmt = $conn->prepare('INSERT INTO Timestamps (date, status, device, userid, username, comment, browserPlatform) VALUES (?, ?, ?, ?, ?, ?, ?)')) {

    /* bind parameters to values */
    $stmt->bind_param("sssisss", $jsonArray['date'], $jsonArray['status'],$jsonArray['device'], $jsonArray['userid'], $jsonArray['username'], $jsonArray['comment'], $jsonArray['browserPlatform']);

    /* execute query */
    $stmt->execute();
    /* close statement */
    $stmt->close();
}

$conn->close();
?>
