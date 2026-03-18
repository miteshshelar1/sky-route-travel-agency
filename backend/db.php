<?php

$host = "localhost";
$user = "root";
$pass = "";
$db   = "travel_agency";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {

    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);

    exit;
}

/* UTF8 support */

$conn->set_charset("utf8");

?>