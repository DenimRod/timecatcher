<?php
include 'ri_config.php';
  // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}
  //Get params
$userid = $_GET['userid'];
$amount = $_GET['amount'];

  // ? = Parameter, werden danach mit Werten befüllt
if ($stmt = $conn->prepare('SELECT * FROM Timestamps WHERE userid = ? ORDER BY date DESC LIMIT 0 , ?')) {

    /* bind parameters to values */
    $stmt->bind_param("ii", $userid, $amount);

    /* execute query */
    $stmt->execute();
    $result = $stmt->get_result();

    echo '[';
        // output data of each row
       $rowNr = 0;
       while($row = $result->fetch_assoc()) {
         $rowNr++;
         echo '{ "id":"' . $row["id"] . '","date":"' . $row["date"] . '", "status":"' . $row["status"] . '","userid":"' . $row["userid"] . '","username":"' . $row["username"] . '","comment":"' . $row["comment"] . '","device":"' . $row["device"] . '","browserPlatform":"' . $row["browserPlatform"] . ' "}';
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
