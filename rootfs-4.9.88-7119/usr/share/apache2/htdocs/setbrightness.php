<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
.slidecontainer {
    width: 80%;
}

.slider {
    -webkit-appearance: none;
    width: 80%;
    height: 15px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
}
</style>
</head>
<body>
<?php
// define variables and set to empty values
$brightnessErr = "";
$brightness = 0;
$newbrightness = -1;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (empty($_POST["brightness"])) {
		$ipaddrErr = "brightness is required";
	} else {
		$brightness = (int)test_input($_POST["brightness"]);
		// check if ipaddr only contains letters and whitespace
		if ($brightness <1 || $brightness > 7) {
			$brightnessErr = "Invalid brightness format"; 
		}
	}
}

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>

<h3>A demonstration of Brightness Slider Control</h3>

<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
<div class="""slidecontainer">
  	<input type="range" 
		min="1" 
		max="7" 
		value="<?php 
				$command = "cat /sys/class/backlight/backlight/brightness";
				$readbrightness= (int)exec ($command); 
				$brightness = round($readbrightness);
				echo $brightness;
				?>" 
		class="slider" id="myRange"><br>
Value: <input type="text" 
			name="brightness" 
			id="Value" 
			size="10" 
			value="<?php 
				$command = "cat /sys/class/backlight/backlight/brightness";
				$readbrightness= (int)exec ($command); 
				$brightness = round($readbrightness); 
				echo $brightness;
				?>">
	<span class="error">* <?php echo $brightnessErr;?></span>
	<br><br>
</div>
<input type="submit" name="submit" value="Set brightness">  
</form>
<script>
	var slider = document.getElementById("myRange");
	var output = document.getElementById("Value");
	output.innerHTML = slider.value;

	slider.oninput = function() {
		//output.innerHTML = this.value;
		document.getElementById("Value").value = this.value;
	}
</script>

<?php
	$command = "cat /sys/class/backlight/backlight/brightness";
	$readbrightness= (int)exec ($command); 
	echo "Real:".$readbrightness."<br>" ;
	$oldbrightness = round($readbrightness );
	echo "PRI :".$oldbrightness."<br>" ;
	$newbrightness = (int)test_input($_POST["brightness"]);
	if($newbrightness == null)
		$newbrightness = $oldbrightness;
	echo "SET ".$newbrightness."<br>" ;
	if($oldbrightness != $newbrightness)
	{
		if($newbrightness > 7 || $newbrightness < 1)
			$newbrightness=5;
		$setbrightness = round($newbrightness);
		$command = "echo '$setbrightness' > /etc/brightness";
		exec ($command);
		$command = "echo '$setbrightness' > /sys/class/backlight/backlight/brightness";
		exec ($command);
		header("Refresh:0");
	}
?>

</body>
</html>
