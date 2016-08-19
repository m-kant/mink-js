
	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}



	mk.u.addClass = function(el,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(el.className)) {return;}
		el.className = (el.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};

	mk.u.removeClass = function(el,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		el.className = el.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};

	mk.u.toggleClass = function(el,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(el.className)){
			el.className = el.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		}else{
			el.className = (el.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		}
	};

	mk.u.hasClass = function(el,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		return re.test(el.className);
	};


	/**
	* Оборачивает элемент указанным тэгом
	* @param {DOMElement} targetEl ДОМ элемент, который нужно обернуть
	* @param {string} tagName имя тэга, которым оборачиваем
	* @param {object} attribs атрибуты тэга, вида {class:'myClass',id:'myID'}
	* @returns {DOMElement} элемент обертка */
	mk.u.wrap = function(targetEl,tagName,attribs){
		var wrapper = document.createElement(tagName);
		if(attribs){
			for(var attribName in attribs){
				wrapper.setAttribute( attribName,attribs[attribName] );
			}
		}

		targetEl.parentNode.insertBefore(wrapper,targetEl);
		wrapper.appendChild(targetEl);

		return wrapper;
	};


	/** заполняет DOM element данными из объекта
	 * @param {DOMElement} element dom-элемент, в который заносятся данные
	 * @param {Array} data объект с данными
	 * @param {string} placeholdAttribute	имя атрибута */
	mk.u.fillElement = function(element,data,placeholdAttribute) {
		if(undefined === placeholdAttribute) placeholdAttribute = 'data-key';

		for(var k in data){
			if(!data.hasOwnProperty(k))continue;
			var elementsList = element.querySelectorAll('['+placeholdAttribute+'="'+k+'"]');
			for(var i=0; i<elementsList.length; i++){
				elementsList[i].innerHTML = data[k];
			}
		}
		return(element);
	};


	/** загружает файл в укзанный элемент DOM в СИНХРОННОМ режиме
	 * использует jQuery
	 * @param {string} url адрес файла, который нужно загрузить
	 * @param {DOMElement|jQuery} target элемент, куда внедряется файл
	 * @return {Void}  */
	mk.u.includeFile = function(url,target){
		jQuery.ajax({
			url:		url,
			data:		{},
			method:		'GET',
			dataType:	'text',
			success:	function(response, textStatus, jqXHR){
							$(target).html(response);
						},
			error:		function( jqXHR, textStatus, errorThrown ){
							throw new Error('Не удалось загрузить файл.'+errorThrown);
						},
			async:   	false
		});
	};

	/** ПОСЛЕДОВАТЕЛЬНО линкует файлы в точке вызова, добавляя теги script или link
	 * @param {String|Array} urls путь или массив путей к линкуемому файлу с расширением .css или .js
	 * @param {string} prefix приставка к каждому url
	 * @param {string} suffix окончание к каждому url */
	mk.u.writeLink = function(urls,prefix,suffix){
		if( !(urls instanceof Array) ) urls = [urls];
		if(undefined === prefix) prefix = '';
		if(undefined === suffix) suffix = '';

		var link,url,clearUrl;
		for(var i=0; i<urls.length; i++){
			url = prefix+urls[i]+suffix;
			clearUrl = url.replace(/\?.+$/,'');
			if( '.js' === clearUrl.substr(-3) ){
				link = '<scrip'+'t type="text/javascript" src="'+url+'"></scrip'+'t>';
			}else if( '.css' === clearUrl.substr(-4) ){
				link = '<link rel="stylesheet" type="text/css" href="'+url+'" />';
			}else if( '.less' === clearUrl.substr(-5) ){
				link = '<link rel="stylesheet/less" type="text/css" href="'+url+'" />';
			}else{
				throw new Error('Невозможно прилинковать файл '+url+' - поддерживаются файлы .js, .css или .less');
			}
			/* jshint evil: true */
			document.write(link);
		}
	};



	/** создает в разделе head тэги link или javascript для линкования файлов
	 * @param {String|Array} urls путь или массив путей к линкуемому файлу с расширением .css или .js
	 * @param {string} prefix приставка к каждому url
	 * @param {string} suffix окончание к каждому url */
	mk.u.appendLink = function(urls,prefix,suffix){
		if( !(urls instanceof Array) ) urls = [urls];
		if(undefined === prefix) prefix = '';
		if(undefined === suffix) suffix = '';


		var linkEl,url,urlExt;
		for(var i=0; i<urls.length; i++){
			url = prefix+urls[i]+suffix;
			urlExt = url.replace(/#.*$/,'').replace(/\?.*$/,'').replace(/^.*\./,'');

			if( 'js' === urlExt ){
				linkEl = document.createElement('script');
				linkEl.type = 'text/javascript';
				linkEl.src = url;
			}else if( 'css' === urlExt ){
				linkEl = document.createElement('link');
				linkEl.type = 'text/css';
				linkEl.rel = 'stylesheet';
				linkEl.href = url;
			}else if( 'less' === urlExt ){
				linkEl = document.createElement('link');
				linkEl.type = 'text/css';
				linkEl.rel = 'stylesheet/less';
				linkEl.href = url;
			}else{
				throw new Error('Невозможно прилинковать файл '+url+' - поддерживаются файлы .js, .css или .less');
			}

			document.head.appendChild(linkEl);
		}
	};


	/** создает в разделе head тэги link или javascript для линкования файлов,
	 * в том случае если указанный скрипт (стиль) еще не присоединен
	 * @param {String|Array} urls путь или массив путей к линкуемому файлу с расширением .css или .js
	 * @param {string} prefix приставка к каждому url
	 * @param {string} suffix окончание к каждому url */
	mk.u.appendLinkOnce = function(urls,prefix,suffix){
		if( !(urls instanceof Array) ) urls = [urls];
		if(undefined === prefix) prefix = '';
		if(undefined === suffix) suffix = '';

		var linkEl,url,urlExt;
		for(var i=0; i<urls.length; i++){
			url = prefix+urls[i]+suffix;
			urlExt = url.replace(/#.*$/,'').replace(/\?.*$/,'').replace(/^.*\./,'');
			
			if( 'js' === urlExt ){
				if(document.querySelector('script[src='+url+']')){continue;}
				linkEl = document.createElement('script');
				linkEl.type = 'text/javascript';
				linkEl.src = url;
			}else if( 'css' === urlExt ){
				if(document.querySelector('link[href='+url+']')){continue;}
				linkEl = document.createElement('link');
				linkEl.type = 'text/css';
				linkEl.rel = 'stylesheet';
				linkEl.href = url;
			}else if( 'less' === urlExt ){
				if(document.querySelector('link[href='+url+']')){continue;}
				linkEl = document.createElement('link');
				linkEl.type = 'text/css';
				linkEl.rel = 'stylesheet/less';
				linkEl.href = url;
			}else{
				throw new Error('Невозможно прилинковать файл '+url+' - поддерживаются файлы .js, .css или .less');
			}

			document.head.appendChild(linkEl);
		}
	};


