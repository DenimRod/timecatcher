 <?php
 include 'ri_config.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = 'SELECT * FROM mytable';
$result = $conn->query($sql);
echo '[';
$rowNr = 0;

    // output data of each row
    while($row = $result->fetch_assoc()) {
			$rowNr++;
      //			echo '{ "id":"' . $row["id"] . '", "datum":"' . $row["booking_date"]. '", "zeit":"' . $row["start_time"] . '" }';
      //			echo '{ "id":"' . $row["id"] . '"SP1":"' . $row["Spalte1-Int"]. '", "SP2":"' . $row["Spalte2-Str"] . '" }';
			echo '{ "id":"' . $row["id"]. '", "created":"' . $row["created"] . '" }';
			if ($rowNr < $result->num_rows) {
				echo ',';
			}
    }

echo ']';

$conn->close();
?>
