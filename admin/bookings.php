<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Admin Bookings</title>

<style>

body{
font-family:Arial;
background:#f4f6fb;
padding:30px;
}

table{
width:100%;
border-collapse:collapse;
background:white;
}

th,td{
padding:12px;
border:1px solid #ddd;
text-align:center;
}

th{
background:#141B34;
color:white;
}

</style>

</head>

<body>

<h2>Travel Bookings</h2>

<table>

<thead>

<tr>
<th>Booking ID</th>
<th>Departure</th>
<th>Destination</th>
<th>Travel Date</th>
<th>Travelers</th>
<th>Amount</th>
<th>Status</th>
</tr>

</thead>

<tbody id="bookingTable"></tbody>

</table>


<script>

function loadBookings(){

fetch("../backend/get_bookings.php")

.then(res=>res.json())

.then(data=>{

let html="";

data.forEach(b=>{

html+=`

<tr>

<td>${b.booking_code}</td>
<td>${b.departure}</td>
<td>${b.destination}</td>
<td>${b.travel_date}</td>
<td>${b.total_travelers}</td>
<td>₹ ${b.total_amount}</td>
<td>${b.status ?? "Pending"}</td>

</tr>

`;

});

document.getElementById("bookingTable").innerHTML=html;

});

}

loadBookings();

/* AUTO REFRESH EVERY 5s */

setInterval(loadBookings,5000);

</script>

</body>
</html>