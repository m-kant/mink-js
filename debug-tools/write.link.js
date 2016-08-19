	// ПОСЛЕДОВАТЕЛЬНО прописывает линки к файлам в точке вызова
	// если document.write заменить на работу с DOMElement.appendChild,
	// загрузка будет асинхронной и это может нарушить работу скриптов
	function writeLink(urls,prefix){
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