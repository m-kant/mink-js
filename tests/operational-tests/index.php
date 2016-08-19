<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="format-detection" content="telephone=no" />
	<meta name="viewport" content="user-scalable=yes, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=medium-dpi" />
	<title><?php  echo $_SERVER['SERVER_NAME'],' content:' ?></title>
</head>

<body><?php  echo 'Server: ',$_SERVER['SERVER_NAME'];?>
<ul>
	<?php  echo menu();?>
</ul>
</body></html>
<?php 
	// FUNCTIONS


	function menu(){
		$folder='./';
		$tpl='<li><a href="%link%">%name%</a></li>';

		$d=dir($folder);
		$i=0;
		while($dr = $d->read()){
			if($dr=='..' or $dr=='.' or !is_dir($folder.$dr) or '_' == substr($dr,0,1)){continue;}

			$res[$i]['link']=$dr.'/';
			$res[$i]['name']=$dr;
			if(is_file($folder.$dr.'/description.txt')){
				$lines = file($folder.$dr.'/description.txt');
				$res[$i]['name']=$lines[0];
			}
			
			$i++;
		}
		echo  renderTpl($tpl,$res);
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
?>
