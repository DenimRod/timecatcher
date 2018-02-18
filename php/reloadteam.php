<?php
include 'ri_config.php';
  // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}
  //Get params
$companyid = $_GET['companyid'];
$sortby = $_GET['sortby'];
$direction = $_GET['direction'];

if($direction == "ASC")
  {$sortby .= " ASC";}
else {$sortby .=" DESC";}
  // ? = Parameter, werden danach mit Werten befüllt
if ($stmt = $conn->prepare('SELECT * FROM Users WHERE companyid = ? ORDER BY '. $sortby)) {

    /* bind parameters to values */
    $stmt->bind_param("i", $companyid);

    /* execute query */
    $stmt->execute();
    $result = $stmt->get_result();

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

    /* close statement */
    $stmt->close();
}

$conn->close();
?>
