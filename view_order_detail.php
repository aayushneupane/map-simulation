<?php
session_start(); 
require "config/config.php"; 

date_default_timezone_set("America/Los_Angeles");
if(!isset($_SESSION['login_email']))
{ 
 header("location: login.php");
}
else
{
	$login_session=$_SESSION['login_email'];
?>

<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>View Order Detail</title>
<script type="text/javascript" src="script/googlemaps.js"></script> 
<script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=places,geometry" >
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
<?php include "topnav.php";?>

    <div class="col-sm-5" style="background-color:white;">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Summary Order Detail</h3>
		</div>
		<div class="panel-body"> 
		 <?php
		  $sql_user = "SELECT * FROM customers WHERE email = '" . $login_session . "'";
		$query = mysqli_query($con,$sql_user);
		 if(!$query)
		{
			echo "Query does not work.". mysqli_error($con);die;
		}
		 while($data = mysqli_fetch_array($query))
		{
			$fullname = $data['name'] ;
			$email = $data['email'];
			$customer_id = $data['id'];
			$phone  = $data['phone'];  
			$address  = $data['address'];  
			$city = $data['city'];  
			$zipcode  = $data['zipcode'];
			$state = $data['state'];
			$country = $data['country'];
		}
		echo "<strong>Billing Address</strong><br>";
		echo "".$fullname."</strong>";



		echo "<br>";
		echo "<div id= 'address'>";
		echo $address;
		echo "<br>";
		
		//echo "".$city.".",".".$state." &nbsp; ".$zipcode."";
		echo $city . ", ". $state. ", ".$zipcode;
		echo "</div>";
		echo "<br>";
		echo "Email: " .$email."";
		echo "<br>";
		echo "Phone: ".$phone."";
		echo "<br>";
		echo "<br>";

		echo "<br>";
		$sql11 = "SELECT * from orders where id=".$_GET['order_id']." " ;
		$query = mysqli_query($con,$sql11);
		 if(!$query)
		{
		   echo "Query does not work.". mysqli_error($con);die;
		}
		while($data = mysqli_fetch_array($query))
		{
			echo "Order Number: 10" .$data['id']."<br>";
			echo "Date        :  <span id='date'>" .$data['date']."</span><br>";	
			echo "Total Paid: $".sprintf("%01.2f", $data['total'])."<br>";
			echo "Payment Type: " .$data['payment']."<br>";
			echo "Card Number: " .$data['card_number']."<br>";
			echo "Expiration Date: " .$data['card_expire']."<br><br><br>";
			echo "Order Status:<div id='delivery-status'></div>";
		}
		$order_detail = "SELECT * from order_detail where order_id=".$_GET['order_id']." " ;
		$query = mysqli_query($con,$order_detail);
		 if(!$query)
		{
		   echo "Query does not work.". mysqli_error($con);die;
		}
		?>
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
        
		<table width="100%" class="table">
		  <tbody>
			<tr>

			  <td width="40%">Item(s)</td>
			  <td width="11%">Quantiy</td>
			  <td width="14%">Price</td>
			  <td width="25%">Sub-Total</td>

			</tr>

			
		<?php    
		while($data = mysqli_fetch_array($query))
		{
			$order_id =   $data['order_id'] ;
			$item_name = $data['product_name'] ;
			$qty = $data['quantity'] ;
			$price = $data['price'];
			$subtotal = $data['subtotal'];



		?>
			 

			 <?php echo "<td>".$item_name."</td>";?>
			 <?php echo "<td>".$qty."</td>";?>
			 <?php echo "<td>".$price."</td>";?>
			 <?php echo "<td>".sprintf("%01.2f", $subtotal)."</td></tr>";?>
			  <?php
		}
		?>


			  
			  
			

		  </tbody>
		</table>

		<?php

		}
		?>



		
		


		
		<div class="panel-footer">Thank You For Shopping. Go
		Back to <a href="index.php">Main Site</a> 
		</div>
	</div>
</div>
</body>
</html>