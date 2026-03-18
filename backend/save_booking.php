<?php

header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

include "db.php";

/* GET JSON DATA */

$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    echo json_encode([
        "status"=>"error",
        "message"=>"Invalid JSON data"
    ]);
    exit;
}

/* SAFE VARIABLES */

$departure = $data["departure"] ?? "";
$destination = $data["destination"] ?? "";
$travel = $data["travelDate"] ?? "";
$return = $data["returnDate"] ?? "";
$package = $data["package"] ?? "";
$totalTravelers = $data["totalTravelers"] ?? 0;
$totalAmount = $data["totalAmount"] ?? 0;


/* SAVE BOOKING */

$stmt = $conn->prepare("
INSERT INTO bookings
(departure,destination,travel_date,return_date,package,total_travelers,total_amount)
VALUES (?,?,?,?,?,?,?)
");

$stmt->bind_param(
"sssssii",
$departure,
$destination,
$travel,
$return,
$package,
$totalTravelers,
$totalAmount
);

$stmt->execute();

$booking_id = $stmt->insert_id;


/* BOOKING CODE */

$booking_code = "SRTA-" . (1000 + $booking_id);

$conn->query("UPDATE bookings SET booking_code='$booking_code' WHERE id='$booking_id'");


/* SAVE TRAVELERS */

if(isset($data["travelers"])){

foreach($data["travelers"] as $t){

$name = $t["name"] ?? "";
$dob = $t["dob"] ?? "";
$gender = $t["gender"] ?? "";

$passport = $t["passport"] ?? "";
$nationality = $t["nationality"] ?? "";
$phone = $t["phone"] ?? "";
$email = $t["email"] ?? "";

$stmt2 = $conn->prepare("
INSERT INTO travelers
(booking_id,name,dob,gender,passport,nationality,phone,email)
VALUES (?,?,?,?,?,?,?,?)
");

$stmt2->bind_param(
"isssssss",
$booking_id,
$name,
$dob,
$gender,
$passport,
$nationality,
$phone,
$email
);

$stmt2->execute();

}

}


/* RESPONSE */

echo json_encode([
"status"=>"success",
"booking_code"=>$booking_code
]);

?>