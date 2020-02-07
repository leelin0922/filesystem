<!DOCTYPE HTML>  
<html>
<head>
<style>
.error {color: #FF0000;}
</style>
</head>
<body>  
<h1>The On/Off Test</h1>
<?php 
$newtype = $type = $typeErr= "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$command = "cat /etc/onoff-counter";
	$counters = exec ($command);
	if($counters >=0)
	{
		$counters= $counters+1;
		$type = "Start";
	}
	else
	{
		$counters=-1;
		$type = "Stop";
	}
	if (empty($_POST["type"])) {
		$typeErr = "type is required";
	} else {
		$type = test_input($_POST["type"]);
	}
	if($newtype == null)
		$newtype=$type;
}

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
	<input type="radio" name="type"
		<?php
			$command = "cat /etc/onoff-counter";
			$counters = exec($command);
			if($counters >= 0)
				$type ="Start";
			if (isset($type)&& $type == "Start") 
			{
				$type ="Start";
				echo "checked";
			}
		?> 
    value="Start">Start
	<input type="radio" name="type"
		<?php 
			$command = "cat /etc/onoff-counter";
			$counters = exec ($command);
			if($counters < 0)
				$type = "Stop";
			if (isset($type) && $type == "Stop") 
			{
				$type ="Stop";
				echo "checked";
			}
		?> 
	value="Stop">Stop
	<span class="error">* <?php echo $typeErr;?></span>
	<br><br>
	<input type="submit" name="submit" value="Submit" autofocus>  
	<br><br>
</form>
<?php
	if($newtype == null)
		$newtype = $type;
	if($type == $newtype)
	{
	}
	else
	{
		if( $newtype == "Stop")
		{
			$type = $newtype = "Stop";
			$command = "echo '-1' > /etc/onoff-counter";
			exec($command);
			exec("sync");
			sleep(1);
		}
		else
		{
			$type = $newtype = "Start";
			$command = "echo '0 ' > /etc/onoff-counter";
			exec($command);
			exec("sync");
			sleep(1);
		}
		header("Refresh:1");
	}
	if($counters>=0)
	{
		if( $newtype == "Start")
		{
			echo "<h2>Times: $counters</h2>";
			$command = "echo $counters > /tmp/onoff";
			exec($command);
		}
	}
?>
</body>
</html>
