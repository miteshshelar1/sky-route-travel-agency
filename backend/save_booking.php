<?php

header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$departure = $data["departure"];
$destination = $data["destination"];
$travel = $data["travelDate"];
$return = $data["returnDate"];
$package = $data["package"];
$totalTravelers = $data["totalTravelers"];
$totalAmount = $data["totalAmount"];

/* SAVE BOOKING */

$conn->query("INSERT INTO bookings
(departure,destination,travel_date,return_date,package,total_travelers,total_amount)
VALUES
('$departure','$destination','$travel','$return','$package','$totalTravelers','$totalAmount')");

$booking_id = $conn->insert_id;

/* BOOKING CODE */

$booking_code = "SRTA-" . (1000 + $booking_id);

$conn->query("UPDATE bookings SET booking_code='$booking_code' WHERE id='$booking_id'");

/* SAVE TRAVELERS */

foreach($data["travelers"] as $t){

$name = $t["name"];
$dob = $t["dob"];
$gender = $t["gender"];

$passport = $t["passport"];
$nationality = $t["nationality"];
$phone = $t["phone"];
$email = $t["email"];

$conn->query("INSERT INTO travelers
(booking_id,name,dob,gender,passport,nationality,phone,email)
VALUES
('$booking_id','$name','$dob','$gender','$passport','$nationality','$phone','$email')");

}

echo json_encode([
"status"=>"success",
"booking_code"=>$booking_code
]);

?>