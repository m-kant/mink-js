
	linkUrls = [
		'<?php  echo implode("',\n'", flist($_GET['f'])) ?>'
	];
	debugToolsWriteLink( linkUrls,'' );


	// ПОСЛЕДОВАТЕЛЬНО прописывает линки к файлам в точке вызова
	// если document.write заменить на работу с DOM,
	// загрузка будет асинхронной и это может нарушить работу скриптов
	function debugToolsWriteLink(urls,prefix){
		if( !(urls instanceof Array) ) urls = [urls];
		if(undefined === prefix) prefix = '';

		var link;
		for(var i=0; i<urls.length; i++){
			url = prefix+urls[i];
			if( '.js' === url.substr(-3) ){
				link = '<scrip'+'t type="text/javascript" src="'+url+'"></scrip'+'t>';
			}else if( '.css' === url.substr(-4) ){
				link = '<link rel="stylesheet" type="text/css" href="'+url+'" />';
			}else if( '.less' === url.substr(-5) ){
				link = '<link rel="stylesheet/less" type="text/css" href="'+url+'" />';
			}else{
				throw new Error('Невозможно прилинковать файл '+url+' - поддерживаются файлы .js, .css или .less');
			}
			document.write(link);
		}
	};


<?php 

	// грузит js-файлы из каталога (включая подкаталоги), указанного в GET переменной f
	// например <script charset='UTF-8' src='link.js.php?f=monitor'></script>

	//printScript(flist($_GET['f']),'/monitor/js/_app-src/');

	function flist($folderName){
		$folder="$folderName/";
		$res = array();
		$d=dir($folder);
		while($f = $d->read()){
			if('.' === $f or '..' === $f)	{continue;}
			if('_' === substr($f,0,1) )		{continue;}

			if(is_dir($folder.$f)){
				$res = array_merge( $res, flist($folder.$f) );
			}else{
				if('.js' !== substr($f, -3)){ continue;}
				$res[]="$folderName/$f";
			}
		}
		$d->close();
		return $res;
	}

	function printScript($array,$prefix=''){
		foreach ($array as $key => $value) {
			echo "<script charset='UTF-8' src='$prefix$value'></script>\r\n";
		}

	}
?>

