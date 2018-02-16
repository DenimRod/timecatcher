<?php
include 'ri_config.php';
  // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}
  //Get params
$inputID = $_GET['inputID'];
  //Get user according to InputID
$sql = 'SELECT * FROM Users WHERE password = ' . $inputID;
$result = $conn->query($sql);
echo '[';

    // output data of each row
   $rowNr = 0;
   while($row = $result->fetch_assoc()) {
     $rowNr++;
     echo '{ "id":"' . $row["id"]. '", "name":"' . $row["name"] . '", "password":"' . $row["password"] . '", "status":"' . $row["status"] . '", "applevel":"' . $row["applevel"] . '", "companyid":"' . $row["companyid"] . '", "lasttimestamp":"' . $row["lasttimestamp"] . '", "lastcomment":"' . $row["lastcomment"] . '", "worktimeToday":"' . $row["worktimeToday"] . '", "lasttimestampISO":"' . $row["lasttimestampISO"] . '", "lasttimestampUTC_d":"' . $row["lasttimestampUTC_d"] . '", "userID":"' . $row["userID"] . '" }';
     if ($rowNr < $result->num_rows) {
       echo ',';
     }
   }
echo ']';
$conn->close();
?>
