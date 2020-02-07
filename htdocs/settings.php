<?php header("Access-Control-Allow-Origin: *") ?>
<?php
    include 'functions.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $categories = $data["categories"];
    $type = $data["type"];
	error_log("settings");

    // 处理Network部分的设置内容
    if ($categories == "network") {
	error_log("network");
        if ($type == "dhcp" || $type == "staticIP") {
            //$networkFile = fopen("/etc/network/interfaces", "w+");
            //$fileString = "";
            //if ($type == "dhcp") {
            //    $fileString = "auto lo \niface lo inet loopback\n\n#dhcp \nauto eth0\niface eth0 inet dhcp\n";
            //} elseif ($type == "staticIP"){
            //    $fileString = $fileString ."auto lo \niface lo inet loopback\n\n";
            //    $fileString = $fileString ."auto eth0\niface eth0 inet static\n";
            //    $fileString = $fileString ."    address ".$data["ip"]."\n";
            //    $fileString = $fileString ."    netmask ".$data["netmask"]."\n";
            //    $fileString = $fileString ."    broadcast ".$data["broadcast"]."\n";
            //    $fileString = $fileString ."    gateway ".$data["gateway"]."\n";
            //} 
            //fwrite($networkFile, $fileString);
            //fclose($networkFile);
	    $devicename=exec("connmanctl services | awk '{print $3}'");
            if ($type == "dhcp") {
	    	//connmanctl config ethernet_001122334455_cable ipv4 dhcp
	    	$command="connmanctl config $devicename ipv4 dhcp";
	    	exec($command);
            }
	    else {
	    	//connmanctl config config ethernet_001122334455_cable ipv4 manual 192.168.20.191 255.255.255.0 192.168.20.1
		$ip=$data["ip"];
		$netmask=$data["netmask"];
		$gateway=$data["gateway"];
	    	$command="connmanctl config $devicename ipv4 manual $ip $netmask $gateway";
	    	exec($command);
	    }
            echo '{"status": "ok"}';
            
            shell_exec('sync');
	    sleep(1);
            //shell_exec('reboot');
        }

        if ($type == "ping") {
            $IPOrDNS = $data["IPOrDNS"];
            //$result = exec("ping -c 1 '".$IPOrDNS."' 2>&1 | grep '0% packet loss,'");
            $result = exec("ping -c 1 '".$gateway."' 2>&1 | grep '0% packet loss,'");
            if ($result != null)
                echo '{"status": "ok"}';
            else
                echo '{"status": "error"}';
        }
    }

    // 处理时间日期相关的设置内容
    if ($categories == "dateAndTime" && $type == "dateAndTime") {
	error_log("dateAndTime");
        $date = $data["date"];
        $time = $data["time"];

        $result = exec("date -s '".$date." ".$time."'");

        if (strpos($result, $time)){
            exec("hwclock -w");
            echo '{"status": "ok"}';
        } else {
            echo '{"status": "error"}';
        }

    }

    // 处理硬件测试部分相关的的内容
    if ($categories == "hardware_test") {
        // 执行硬件测试程序，获取返回的json数据
        //$output = `bin/hardware_test`;
        //$json_array = json_decode($output, true);
	error_log("hardware_test");

        //$test_items = $MiniOS->configs["hardware_test"];
        //$test_items_sections = $MiniOS->get_config_sections($test_items);
        //foreach ($test_items_sections as $item) {
        //    if (isset($test_items[$item]["shell"])) 
	//    {
        //        $result = exec($test_items[$item]["shell"]);
        //        $json_array["data"][$item]["result"] = $result;
        //        if ((isset($test_items[$item]["ret"]) && ($result == $test_items[$item]["ret"])) ||
        //                (! isset( $test_items[$item]["ret"]) && ($result != null))) {
        //            $json_array["data"][$item]["status"] = "ok";
        //        } else {
        //            $json_array["data"][$item]["status"] = "error";
        //        }
        //    }
        //}

        $json_array["status"] = "ok";
        echo json_encode($json_array);
    }
?>


