<?php

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$country = $data['country'];
$state = $data['state'];
$city = $data['city'];
$pincode = $data['pincode'];
$message = $data['message'];

$sql = "INSERT INTO contact_messages
(name,email,phone,country,state,city,pincode,message)
VALUES
('$name','$email','$phone','$country','$state','$city','$pincode','$message')";

mysqli_query($conn,$sql);

echo json_encode(["status"=>"success"]);

?>