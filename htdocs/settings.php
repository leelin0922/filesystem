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
    
    // Burning Mac
    if ($categories == "MAC") 
    {
	if(file_exists("/sys/bus/i2c/devices/0-0050/eeprom")==false)
	{
            echo '{"status": "error", "MAC": "'.$mac_address.'"}';
            return;
	}
        $eeprom_size = 256;
        error_log("hertz error log test!", 0);
	    $bytes = array();
	    $bytes = array_pad($bytes, $eeprom_size, 0xff);
	    $mac_address = $data["MAC"];
	    $macArray = explode(':', $mac_address);

	    $bytes[0] = 0x01;
	    $bytes[1] = 0x06;
	    $bytes[2] = hexdec($macArray[0]);
	    $bytes[3] = hexdec($macArray[1]);
	    $bytes[4] = hexdec($macArray[2]);
	    $bytes[5] = hexdec($macArray[3]);
	    $bytes[6] = hexdec($macArray[4]);
	    $bytes[7] = hexdec($macArray[5]);
	    $bytes[8] = 0x00;
	    $bytes[0xfe] = 0x03;
	    $bytes[0xff] = 0x00;
	    $myfile = fopen("/sys/bus/i2c/devices/0-0050/eeprom", "wb");
	    $i = 0;
	    for (; $i < $eeprom_size; $i++) {
		    fwrite($myfile, pack('C', $bytes[$i]));
	    }
	    fclose($myfile);
	    if ($i == $eeprom_size) {
		    echo '{"status": "ok", "MAC": "'.$mac_address.'"}';
	    } else {
	        echo '{"status": "error", "MAC": "'.$mac_address.'"}';
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


