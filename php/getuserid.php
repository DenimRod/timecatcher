<?php
include 'ri_config.php';
  // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}
  //Get params
$name = $_GET['name'];
$companyid = $_GET['companyid'];

  //Get UserID of User with given name and same company
$sql = 'SELECT * FROM Users WHERE name = "' . $name . '" AND companyid = ' . $companyid;
$result = $conn->query($sql);
echo '[';

    // output data of each row
   $rowNr = 0;
   while($row = $result->fetch_assoc()) {
     $rowNr++;
     echo '{ "id":"' . $row["id"] . '"}';
     if ($rowNr < $result->num_rows) {
       echo ',';
     }
   }
echo ']';
$conn->close();
?>
