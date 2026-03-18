<?php

include "backend/db.php";

$code = $_GET["code"];

$result = $conn->query("SELECT * FROM bookings WHERE booking_code='$code'");

if($result->num_rows > 0){

$row = $result->fetch_assoc();

echo "<h2>Booking Verified</h2>";

echo "<p>Booking ID: ".$row["booking_code"]."</p>";
echo "<p>Destination: ".$row["destination"]."</p>";
echo "<p>Travel Date: ".$row["travel_date"]."</p>";
echo "<p>Total Travelers: ".$row["total_travelers"]."</p>";
echo "<p>Status: ".$row["status"]."</p>";

}
else{

echo "<h2>Invalid Booking</h2>";

}

?>