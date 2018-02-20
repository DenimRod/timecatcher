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
if ($stmt = $conn->prepare('INSERT INTO Login (name, device, userID) VALUES (?, ?, ?)')) {

    /* bind parameters to values */
    $stmt->bind_param("ssi", $jsonArray['name'], $jsonArray['device'],$jsonArray['userID']);

    /* execute query */
    $stmt->execute();

      //get id of created object
    echo $conn->insert_id;

    /* close statement */
    $stmt->close();
}

$conn->close();
?>
