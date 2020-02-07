<!DOCTYPE HTML>  
<html>
<head>
<style>
.error {color: #FF0000;}
</style>
<?php 
	//$temperature  = $prev_total = $prev_idle = $cpuusage = 0;
	$user = $system = $nice = $idle = $wait = $irq = $srq = $zero = 0;
	$type = "Stop";
?>
</head>
<body>  
<h1>The Burn in Test</h1>
<?php 
$newtype = $type;
$typeErr= "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (empty($_POST["type"])) {
		$typeErr = "type is required";
	} else {
		$type = test_input($_POST["type"]);
	}
	if($newtype == null)
		$newtype=$type;
}

function get_server_cpu_usage(){

	$load = sys_getloadavg();
	return $load[0];

}

function ProcStats() 
{    
	$fp=fopen("/proc/stat","r"); 
	if(false===$fp) 
		return false; 
	$a=explode(' ',fgets($fp)); 
	array_shift($a); //get rid of 'cpu' 
	while(!$a[0]) 
	array_shift($a); //get rid of ' ' 
	var_dump($a); 
	fclose($fp); 
	return $a; 
}

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
	cpu usage      : <input type="text" name="cpuusage" value=	"<?php 
					$command ="cat /proc/stat | grep 'cpu '";
												$procstat = exec ($command); 
												$pieces = explode(" ", $procstat);

												$user = (int) $pieces[2];  
												$system = (int) $pieces[3];
												$nice = (int) $pieces[4];
												$idle = (int) $pieces[5];
												$wait = (int) $pieces[6]; 
												$irq = (int) $pieces[7]; 
												$srq = (int) $pieces[8];  
												$zero = (int) $pieces[9]; 
												$prevtotal =( $user + $system + $nice + $idle + $wait + $irq + $srq + $zero);
												$previdle = $idle;

												sleep(1);

												$procstat = exec ($command); 
												$pieces = explode(" ", $procstat);

												$user = (int) $pieces[2];  
												$system = (int) $pieces[3];
												$nice = (int) $pieces[4];
												$idle = (int) $pieces[5];
												$wait = (int) $pieces[6]; 
												$irq = (int) $pieces[7]; 
												$srq = (int) $pieces[8];  
												$zero = (int) $pieces[9]; 
												$total =( $user + $system + $nice + $idle + $wait + $irq + $srq + $zero);

												$diff_idle = $idle-$previdle;
  												$diff_total = ($total - $prevtotal);
												$cpuusage=(float)((( 1000.0 * ( ($diff_total - $diff_idle)) / $diff_total+5) ) / 10);
												echo round($cpuusage,2)."%";
												?>">
	<br><br>
	temperature : <input type="text" name="temperature" value=	"<?php 
												$command ="cat /sys/class/thermal/thermal_zone0/temp";
												$temperature = ((float) exec ($command))/1000; 
												echo $temperature."°C" ;
												?>">
	<br><br>
</form>
<?php
  	//sleep(2);
	header("Refresh:1");
?>
</body>
</html>
