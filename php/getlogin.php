<?php
include 'ri_config.php';
  // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
if ($conn->connect_error) {
   die("Connection failed: " . $conn->connect_error);
}
  //Get params
$loginid = $_GET['loginid'];

  // ? = Parameter, werden danach mit Werten befüllt
if ($stmt = $conn->prepare('SELECT createdAt FROM Login WHERE id = ?')) {

    /* bind parameters to values */
    $stmt->bind_param("i", $loginid);

    /* execute query */
    $stmt->execute();
    $result = $stmt->get_result();

    echo '[';
        // output data of each row
       $rowNr = 0;
       while($row = $result->fetch_assoc()) {
         $rowNr++;
         echo '{ "createdAt":"' . $row["createdAt"] .'"}';
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
