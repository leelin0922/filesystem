<!DOCTYPE HTML>  
<html>
<head>
<style>
.error {color: #FF0000;}
</style>
</head>
<body>  

<?php
// define variables and set to empty values
$ipaddrErr = $netmaskErr = $typeErr = $gatewayErr = "";
$newtype = $ipaddr = $netmask = $type = $gateway = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (empty($_POST["ipaddr"])) {
		$ipaddrErr = "ipaddr is required";
	} else {
		$ipaddr = test_input($_POST["ipaddr"]);
		// check if ipaddr only contains letters and whitespace
		if (!filter_var($ipaddr , FILTER_VALIDATE_IP)) {
			$ipaddrErr = "Invalid ipaddr format"; 
        }
	}
  
	if (empty($_POST["netmask"])) {
		$netmaskErr = "netmask is required";
	} else {
		$netmask = test_input($_POST["netmask"]);
		// check if e-mail address is well-formed
		if (!filter_var($netmask, FILTER_VALIDATE_IP)) {
			$netmaskErr = "Invalid netmask format"; 
		}
	}
    
	if (empty($_POST["gateway"])) {
		$gateway = "";
	} else {
		$gateway = test_input($_POST["gateway"]);
		// check if URL address syntax is valid (this regular expression also allows dashes in the URL)
		if (!filter_var($gateway , FILTER_VALIDATE_IP)) {
			$gatewayErr = "Invalid gateway format";
		}
	}

	if (empty($_POST["type"])) {
		$typeErr = "type is required";
	} else {
		$type = test_input($_POST["type"]);
	}
	if($newtype == null)
		$newtype=$type;
}

function check($browser) {
    $newtype=$browser;
}

function setcheck($browser) {
echo "<h2>Your Input:</h2>";
echo $ipaddr;
echo "<br>";
echo $netmask;
echo "<br>";
echo $gateway;
echo "<br>";
echo "<br>";
echo $type;
echo "<br>";
echo $newtype;
}

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>

<h2>PHP Form Validation Example</h2>
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
	Ipaddress: <input type="text" name="ipaddr" value=
		"<?php 
			$command = "ifconfig 'eth0' | grep 'inet ' | awk '{print $2}' | awk -F ':' '{print $2}'";
			$ipaddr = exec ($command); 
			echo $ipaddr;
			?>">
	<span class="error">* <?php echo $ipaddrErr;?></span>
	<br><br>
	Netmast: <input type="text" name="netmask" value=
		"<?php
			$command="ifconfig 'eth0' | grep 'inet ' | awk -F ' ' '{print $4}' | awk -F ':' '{print $2}'";
			$netmask= exec ($command);
			echo $netmask;
			?>">
	<span class="error">* <?php echo $netmaskErr;?></span>
	<br><br>
	Gateway: <input type="text" name="gateway" value=
		"<?php
			$command="route -n | grep UG | head -n  1 | awk -F ' ' '{print $2}'";
			$gateway= exec ($command);
			echo $gateway;
			?>">
	<span class="error">* <?php echo $gatewayErr;?></span>
	<br><br>
	Type:
	<input type="radio" name="type"
		<?php
			$devicename=exec("connmanctl services | awk '{print $3}'");
			$command = "connmanctl services $devicename | grep Method=dhcp";
			$typecheck = exec ($command);
			if ($typecheck != null)
				$type = "DHCP";
			if (isset($type) && $type=="DHCP") 
				echo "checked";
		?> 
	value="DHCP">DHCP
	<input type="radio" name="type"
		<?php 
			$devicename=exec("connmanctl services | awk '{print $3}'");
			$command = "connmanctl services $devicename | grep Method=manual";
			$typecheck = exec ($command);
			if ($typecheck != null)
				$type = "Manual";
			if (isset($type) && $type=="Manual") 
				echo "checked";
		?> 
	value="Manual">Manual
	<span class="error">* <?php echo $typeErr;?></span>
	<br><br>
	<input type="submit" name="submit" value="Submit">  
</form>

<?php
	echo "<h2>Your Input:</h2>";
	echo $ipaddr;
	echo "<br>";
	echo $netmask;
	echo "<br>";
	echo $gateway;
	echo "<br>";
	echo "<br>";
	if($newtype == null)
		$newtype = $type;
	//echo $newtype;
	//echo "<br>";
	//echo $type;
	//echo "<br>";
	if($type == $newtype)
	{
	}
	else
	{
		if( $newtype == "Manual")
		{
			$ipaddr = test_input($_POST["ipaddr"]);
			$type = $newtype = "Manual";
			$devicename=exec("connmanctl services | awk '{print $3}'");
			$command="connmanctl config $devicename ipv4 manual $ipaddr $netmask $gateway";
			exec($command);
		}
		else
		{
			$type = $newtype = "DHCP";
			$devicename=exec("connmanctl services | awk '{print $3}'");
			$command="connmanctl config $devicename ipv4 dhcp";
			exec($command);
		}
		header("Refresh:1");
	}
	echo $type;
	echo "<br>";
?>

</body>
</html>