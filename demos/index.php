<html>
<head>
<title><?php  echo dirname($_SERVER['PHP_SELF']),' content:' ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport"
		content="user-scalable=yes, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=medium-dpi" />
</head>

<body>
	<?php  echo '<b>',$_SERVER['SERVER_NAME'],dirname($_SERVER['PHP_SELF']),'</b>:' ?>
	<ul>
		<?php  echo menu();?>
	</ul>
</body>
</html>

<?php 
	// FUNCTIONS


	function menu(){
		$folder='./';
		$tpl='<li><a href="%link%">%name%</a></li>';

		$d=dir($folder);
		$i=0;
		while($dr = $d->read()){
			if($dr=='..' or $dr=='.' or !is_dir($folder.$dr)){continue;}
			if('_' == substr($dr, 0, 1 )){continue;}

			$res[$i]['link']=$dr;
			$res[$i]['name']=$dr;
			if(is_file($folder.$dr.'/description.txt')){
				$lines = file($folder.$dr.'/description.txt');
				$res[$i]['name']=$lines[0];
			}

			$i++;
		}
		echo renderTpl($tpl,$res);
	}



	function renderTpl($tpl,$data){
		foreach($data as $idx=>$tpl_data){
			$tpl_data['_idx']=$idx;
			$str.=fillTpl($tpl,$tpl_data);
		}
		return $str;
	}

	function fillTpl($tpl,$data){
		foreach($data as $key=>$val){
			$tpl=str_replace("%$key%",$val,$tpl);
		}
		return $tpl;
	}
