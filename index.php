<?php
session_start();  

date_default_timezone_set("America/Los_Angeles");
?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>View Order Detail</title>
<script type="text/javascript" src="script/googlemaps.js"></script> 
<!--<script type="text/javascript" src="https://maps.google.com/maps/api/js?v=3?key=AIzaSyAFUFlGb4z4CHHQXxOcy5S7EfeK3xr4M_Y?libraries=places,geometry" > -->
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAFUFlGb4z4CHHQXxOcy5S7EfeK3xr4M_Y">
</script>
<link href="css/bootstrap.css" rel="stylesheet" type="text/css">
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
<div class="container">
<?php //include "topnav.php";?>

    <div class="col-sm-5" style="background-color:white;">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Summary Order Detail</h3>
			</div>
			<div>
			<div class="form-group">
			  <div class="col-sm-6">          
				<input type="text" name="address" class="form-control" id="address" placeholder="Address" value="" required>
			  </div>
			</div>
			<div class="form-group">
			  <div class="col-sm-6">          
				<input type="text" name = "city" class="form-control" id="city" placeholder="City" value="" required>
			  </div>
			</div>
			<div class="form-group">
			  <div class="col-sm-6">          
				<input type="number" name = "zipcode" class="form-control" id="zipcode" placeholder="Zip Code" value="" required onblur="blurZipCode()" >
			  </div>
			</div>
			<div class="form-group">
			  <div class="col-sm-6">          
				<input type="text" class="form-control" name="state" id="state" placeholder="State" value="" required>
			  </div>
			</div>
			</div>
		</div>
	</div>

	<div class="col-sm-7" style="background-color:white;">
        <div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Delivery Tracking</h3>
				</div>
			<div class="panel-body"> 
				<div id="map" style="overflow:hidden"></div>
			</div>
        </div>
	</div>
</div>
</body>
</html>