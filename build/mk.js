

	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}


	mk.u.toBoolean = function(val) {
		if('boolean' === typeof val)	return val;
		if('number' === typeof val)		return Boolean(val);
		if(null === val || undefined === val) return false;
		if(val instanceof Array)		return Boolean(val.length);
		if('object' === typeof val)		return Boolean( mk.u.objectLength(val) );
		if('string' !== typeof val)		return Boolean(val);

		val = val.trim();
		switch(val){
			case '':
				return false;
			case 'false':
				return false;
			case 'true':
				return true;
			case '0':
				return false;
			case '1':
				return true;
			default:
				return true;
		}
	};



	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}



	/** выводит на экран произвольное количество аргументов произвольного типа
	 * нужна там где невозможно воспользоваться нормальным console.log() - мобильные девайсы */
	mk.u.log = function(){
		var separator = ' \n';
		var msg = '';
		for(var i=0; i<arguments.length; i++){
			var raw = arguments[i];

			if('object' === typeof raw){
				msg += mk.u.obj2str(raw);
			}else{
				msg += raw;
			}
			msg += separator;
		}

		alert(msg);
	};


	/** true, если включен режим отладки
	 * @returns {Boolean} */
	mk.u._isDebug = function(){
		if(!window.CFG)return false;
		return (CFG.debugMode)?true:false;
	};



	/** преобразует объект в строку
	 * @param {Object} ob
	 * @param {integer} depth глубина сканирования объекта (не используется)
	 * @param {string} prefix табуляторы перед строкой
	 * @returns {string} */
	mk.u.obj2str = function(ob,depth,prefix){
		if(0 === depth){
			return '{.depth exceeded.}';
		}else if(undefined === depth){
			depth = 3;
		}

		if(!prefix)prefix = '';
		var tab = ' ';

		var str = '';

		for(var k in ob){
			if(!ob.hasOwnProperty(k))continue;
			if('function' === typeof ob[k]){
				str += prefix+k+': function() \n';
			}else if('object' === typeof ob[k]){
				str += prefix+k+': \n'+prefix+tab;
				str += mk.u.obj2str(ob[k],depth-1,prefix+tab);
				str += ' \n';
			}else{
				str += prefix+k+': '+ob[k]+' \n';
			}
		}

		return str;
	};

	mk.u.j = function(obj){
		return JSON.stringify(obj,null,4);
	};


	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}


	/**
	 * есть ли в массиве arr значение val
	 * @param {Array} arr
	 * @param {Mixed} val
	 * @returns {Boolean}
	 */
	mk.u.isInArray = function(arr,val) {
		for(var i=0; i<arr.length;i++){
			if (arr[i] === val) return true;
		}
		return false;
	};

	/**
	 * возвращает объект из массива объектов,
	 * в котором el.fieldName = fieldVal
	 * @param {array} arr
	 * @param {string} fieldName
	 * @param {mixed} fieldVal
	 * @returns {mixed}
	 */
	mk.u.getFromArray = function(arr,fieldName,fieldVal) {
	   var res;
	   for(var i=0; i<arr.length; i++){
		   if( fieldVal === arr[i][fieldName] ){
			   res = arr[i];
			   break;
		   }
	   }
	   return res;
	};


	/** добавляет значение в конец массива, только в том случае, если такого значения в массиве нет
	 * @param {Array} arr массив, в который добавляем елемент
	 * @param {Mixed} val значение, которое не должно повторяться в массиве, может быть несколько через запятую
	 * @return {Number} новая длина массива */
	mk.u.pushUnique = function(arr,val){
		for(var i=1; i<arguments.length;i++){
			val = arguments[i];
			if( mk.u.isInArray(arr,val) )return arr.length;
			arr.push(val);
		}
		return arr.length;
	};

	/** удаляет из массива элемент с указанным значением
	 * @param {Array} arr массив, из которого удаляем елемент
	 * @param {Mixed} val значение, которое нужно удалить, может быть несколько через запятую
	 * @return {Number} новая длина массива */
	mk.u.removeValFromArray = function(arr,val){
		for(var i=1; i<arguments.length;i++){
			val = arguments[i];
			var idx = arr.indexOf(val);
			if( -1 === idx )continue;
			arr.splice(idx,1);
		}
		return arr.length;
	};



	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}


	/** Длина объекта
	 * @param {Object} o объект */
	mk.u.objectLength = function(o){
		if(null === o) return;
		if(undefined === o) return;

		var length = 0;
		for(var i in o){
			if(o.hasOwnProperty(i)){length++;}
		}
		return length;
	};


	/**
	 * merges two or more objects
	 * @returns {object}
	 */
	mk.u.merge = function(){
		if(0 === arguments.length){return {};}

		var res = {};
		for(var i=0; i<arguments.length; i++){
			var obj = arguments[i];
			for(var k in obj){
				if(!obj.hasOwnProperty(k)){continue;}

				if('object' === typeof obj[k]){
					if('object' !== typeof res[k]){
						res[k] = {};
					}
					res[k] = mk.u.merge(res[k],obj[k]);
				}else{
					res[k] = obj[k];
				}
			}
		}

		return res;
	};


	/** Замешивает в первый объект свойства и методы из объекта mixin
	 * может быть указано несколько mixin - объектов через запятую
	 * @param {Object} target объект, в который осуществляется примесь
	 * @param {Object} mixin объект, свойства которого нужно внедрить, может быть несколько штук */
	mk.u.mixInto = function(target,mixin){
		for(var i=1; i<arguments.length; i++){
			mixin = arguments[i];
			for(var k in mixin){
				if(!mixin.hasOwnProperty(k)) continue;
				target[k] = mixin[k];
			}
		}
		return target;
	};
	/** Замешивает в первый объект свойства и методы из объекта mixin
	 * может быть указано несколько mixin - объектов через запятую
	 * !!! если в целевом объекте уже есть свойство из mixin объекта,
	 * то остается целевое, из миксина не вставляется
	 * @param {Object} target объект, в который осуществляется примесь
	 * @param {Object} mixin объект, свойства которого нужно внедрить, может быть несколько штук */
	mk.u.mixUniqueInto = function(target,mixin){
		var skipped = [];
		for(var i=1; i<arguments.length; i++){
			mixin = arguments[i];
			for(var k in mixin){
				if(!mixin.hasOwnProperty(k)) continue;
				if(target[k] !== undefined){ skipped.push(k); continue;}
				target[k] = mixin[k];
			}
		}
		if(skipped.length) console.warn('Duplicating properties were skipped while mixing: '+skipped.join(', '));
		return target;
	};

	/**
	 * Наследование класса Child от класса Parent
	 * @param {function} Child конструктор дочернего класса
	 * @param {function} Parent конструктор родительского класса
	 * @returns {undefined}
	 */
 	mk.u.extendClass = function(Child, Parent) {
		var F = function() { };
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.prototype.superclass = Parent.prototype;
	};


	mk.u.clone = function(obj){
		// 'for' is much faster then 'JSON.parse( JSON.stringify(obj) )'
		var res;
		if( obj instanceof Array){
			res = [];
			for(var i=0; i<obj.length; i++){
				if('object' === typeof obj[i] && null !== obj[i]){
					res.push( mk.u.clone(obj[i]) );
				}else{
					res.push(obj[i]);
				}
			}
		}else{
			res = {};
			for(var i in obj){
				if(!obj.hasOwnProperty(i))continue;
				if('object' === typeof obj[i] && null !== obj[i]){
					res[i] = mk.u.clone(obj[i]);
				}else{
					res[i] = obj[i];
				}
			}
		}
		return res;
	};



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




	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}

	/** вывод строки на экран, шоткат к alert
	 * или можно переопределить через свое модальное окно
	 * @param {string} msg
	 * @returns {undefined} */
	mk.u.p = function(msg){
		//alert(msg);
		$.mkmodal.open({content:msg});
	};


	/** оформляет сообщение об ошибке через mk.u.p всплывающего окна-алерта
	 * @param {Error} e */
	mk.u.err = function(e){
		// это фонгеп чудит выбрасывая event.type=error вместо Error object
		// TODO хорошо бы разобраться
		if(undefined !== e.bubbles) return;

		$.mkmodal.open({title:'Ошибка',content:e});
		//alert('error: '+e);
	};

	/** выводит Exception
	 * @param {error} e */
	mk.u.ex = function(e){
		// это фонгеп чудит выбрасывая event.type=error вместо Error object
		// TODO хорошо бы разобраться
		//if(undefined !== e.bubbles) return;

		$.mkmodal.open({title:'Exception',content:e.message});
		if(mk.u._isDebug()){ console.error(e); }

	};


	/**
	 * обработчик ошибок для window.onerror
	 * @param {string} msg
	 * @param {string} url
	 * @param {string} line
	 * @returns {undefined}
	 */
	mk.u.windowOnError = function(msg, url, line){
		if(mk.u._isDebug()){
			mk.u.err( msg+'<br />line: '+line+'<br />url: '+url );
			console.error('window.onerror: '+msg+'<br />line: '+line+'<br />url: '+url);
		}else{
			mk.u.err( msg );
		}
	};



	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты для работы со временем
		 * @namespace mku */
		mk.u = {};
	}


	/** форматирует число в миллисекундах в строку типа 2дн.5ч.10м. или 5:10
	 * @param {integer} milliseconds
	 * @param {boolean} short выдавать ли короткий формат
	 * @param {array} locale подписи единиц измерения [days,hours,minutes]
	 * @return {string} строка типа 2дн.5ч.10м.  */
	mk.u.formatTimespan = function(milliseconds,short,locale){
		var seconds = Math.floor(milliseconds/1000);
		short = (undefined === short)?false:short;

		var d = Math.floor(seconds/86400);
		var remains = seconds%86400;
		var h = Math.floor(remains/3600);
		remains = remains%3600;
		var m = Math.floor(remains/60);

		var res='';
		if(short){
			if(d !== 0){
				res+= d+locale[0];// days
			}else if(h !== 0){
				res+= h+ Math.round(m/60)+locale[1];
			}else{
				res+= m;
			}
		}else{
			if(d !== 0) res+= ''+d+locale[0];
			if(h !== 0) res+= '&nbsp;'+h+locale[1];
			res+= '&nbsp;'+m+locale[2];
		}


		return res;
	};

	/**
	 * вычисляет объект даты из строки. Строка может содержать дату и время
	 * или только дату или только время. Если только время, то дата = сегодня.
	 * время всегда разделяется двоеточием, дата тире или точкой.
	 * Дата может быть в последовательности год-месяц-день, или наоборот день-месяц-год.
	 * Лишь бы год был четырехзначным. Дата может сокращаться до месяца,
	 * время до часов:минут, время может содержать миллисекунды
	 * @param {string} dateStr строка даты
	 * @return {Date}
	 */
	mk.u.makedate = function(dateStr){
		// есть ли строка времени
		var t = []; // digits from time string
		if( /\d:\d/.test(dateStr) ){
			var tmatches = /[:\d]{3,12}$/.exec(dateStr);
			var tstr = tmatches[0];
			if(!tstr){throw new Error('cant extract time string from string '+dateStr);}
			t = tstr.split(':');
			if(t.length<2 || t.length>4){throw new Error('cant recognize time string '+tstr+' from string '+dateStr);}
		}
		// normalize time set
		while(t.length < 4){
			t.push(0); // add missing time components
		}

		// есть ли строка даты
		var d = []; // date components
		if( /\d[\.-]\d/.test(dateStr) ){
			var rx = RegExp('^[\\.-\\d]{4,10}');
			var dmatches = rx.exec(dateStr);

			var dstr = dmatches[0];
			if(!dstr){throw new Error('cant extract date string from string '+dateStr);}
			d = dstr.split(/[\.-]/);
			if(d.length<2 || d.length>3){throw new Error('cant recognize date string '+dstr+' from string '+dateStr);}

			// if year is at last position, reverse array
			if( 4 === d[d.length-1].length ){ d.reverse(); }

			// normalize date set
			while(d.length < 3){
				d.push(1); // add missing time components
			}

		// no date string, assume date is now
		}else{
			var now = new Date();
			d[0] = now.getFullYear();
			d[1] = now.getMonth()+1;
			d[2] = now.getDate();
		}

		return new Date(d[0], d[1]-1, d[2], t[0], t[1], t[2], t[3] );
	};

	/**
	 * Module to localize HTML. Works even without placeholders.
	 *
	 * @author M.Kantemirov
	 * @site www.mkan.ru
	 */

(function(){

	_hasSibling = function(node){
		if(node.nextSibling){return true;}
		if(node.previousSibling){return true;}
		return false;
	};

	_wrap = function(node){
		var wrapper = document.createElement('span');
		node.parentNode.insertBefore(wrapper,node);
		wrapper.appendChild(node);
		return wrapper;
	};

	 /**
	 * Gets an array of the matching text nodes contained by the specified element.
	 * @param  {!Element} elem The DOM element which will be traversed.
	 * @return {!Array.<!--Node-->} Array of the matching text nodes contained by the specified element.
	 */
	_getTextNodesIn = function (elem) {
		var textNodes = [];
		if (elem) {
			for (var nodes = elem.childNodes, i = nodes.length; i--; ) {
				var node = nodes[i], nodeType = node.nodeType;
				if (nodeType === 3) {
					if (!node.nodeValue.trim()) {continue;}
					if (node.parentNode.getAttribute('data-str')) {continue;}
					textNodes.push(node);
				}
				else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					textNodes = textNodes.concat(_getTextNodesIn(node));
				}
			}
		}
		return textNodes;
	};

	/**
	 *
	 * @namespace localizer
	 */
	localizer={
		transtable:null, // object of localized messages
		localeName:null,
		defaultLocaleName:'en',
		scanText:true,
		scanAttr:true,
		warn:true,


		process: function(element){
			if(!element){element = document;}

			if(this.scanText){
				var texts = _getTextNodesIn(element);

				for(var i=0; i<texts.length;i++){
					var text = texts[i];
					var textVal = text.nodeValue.trim();
					if(!textVal){continue;}
					if(!this.transtable[ textVal ]){continue;}
					var wrapper;
					if(_hasSibling(text)){
						wrapper = _wrap(text);
					}else{
						wrapper = text.parentNode;
					}
					wrapper.setAttribute('data-str',textVal);
					text.nodeValue = this.m( textVal );
				}
			}

			if(this.scanAttr){
				var elems = element.querySelectorAll('[data-str]');
				for(var j=0; j<elems.length;j++){
					var elem = elems[j];
					var elemAlias = elem.getAttribute('data-str');
					if(!elemAlias){continue;}
		//			elem.innerHTML = this.m( elemAlias );
					if(this.transtable[ elemAlias ]){
						elem.innerHTML = this.m( elemAlias );
					}else{
						elem.innerHTML = elemAlias;
					}
				}
			}

		},

		/** возвращает локализованное сообщение по псевдониму сообщения
		 * @param {string} msgAlias
		 * @returns {String}
		 */
		m: function( msgAlias ){
			if(!localizer.transtable){
				if(this.warn){console.warn('No localizer transtable set');}
				return msgAlias;
			}
			if(!localizer.transtable[ msgAlias ]){
				if(this.warn){console.warn('No localized message for alias ',msgAlias);}
				return msgAlias;
			}

			return localizer.transtable[ msgAlias ];
		},

		/** форматирует сообщение в стиле sprintf, поддерживает только тэг %s
		 * например, f('got %s pieces in %s parts',5,2) // got 5 pieces in 2 parts
		 * принимает неограниченное число аргументов, первый - шаблон сообщения
		 * @param {string} msg шаблон сообщения
		 * @returns {String}
		 */
		f: function( msg ){
			for(var i=1; i<arguments.length;i++){
				msg = msg.replace('%s',arguments[i]);
			}
			return msg;
		},

		/**
		 * то же что и f() но принимает в качестве первого аргумента
		 * псевдоним сообщения
		 * @param {string} msgAlias
		 * @returns {undefined}
		 */
		mf: function( msgAlias ){
			// меняем первый аргумент с алиаса на сообщение
			arguments[0] = this.m(msgAlias);
			// вызываем f() со скорректированными аргументами
			return this.f.apply(null,arguments);
		},

		/**
		 * подбор правильной формы множественного числа существительных
		 * @param {integer} num
		 * @param {array} nounSet 3 формы существительного
		 * @property {string} nounSet[0] единственное число, например 1 рубль
		 * @property {string} nounSet[1] множественная форма 2, например 2 рубля
		 * @property {string} nounSet[2] множественная форма 5, например 5 рублей
		 * @returns {undefined}
		 */
		numerous: function(num,nounSet){
			if('string' === typeof nounSet) return nounSet;
			if(nounSet.length === 1){
				return nounSet[0];
			// english language, just singular and plural
			}else if(nounSet.length === 2){
				return (num === 1)?nounSet[0]:nounSet[1];
			// russian language, with 2 plural forms
			}else if(nounSet.length === 3){
				var lastNumber = Number( String(num).substr(-1) );
				if(NaN === lastNumber)throw new Error('Not a number');
				if(1 === lastNumber)return nounSet[0];
				if(lastNumber>1 && lastNumber<5)return nounSet[1];
				return nounSet[2];
			}else{
				throw new Error('Wrong argument format');
			}

		},


		// не понятно зачем
//		minTransLen: function(){
//			if(this.transtable === null){throw new Error('localizer transtable is null');}
//			var min = 50;
//			for(var k in this.transtable){
//				if(!this.transtable.hasOwnProperty(k)){continue;}
//				if(min < this.transtable[k].length){continue;}
//				min = this.transtable[k].length;
//			}
//
//		},


		getBrowserLocale: function(){
			var preLang =
					navigator.userLanguage ||		//
					navigator.language ||			// (Netscape - Browser Localization)
					navigator.browserLanguage ||	// (IE-Specific - Browser Localized Language)
					navigator.systemLanguage;		// (IE-Specific - Windows OS - Localized Language)
			var matches = /^[a-zA-Z]+/.exec(preLang); // вместо ru или ru-RU возвращает только ru

			if(!matches){return null;}

			var res = matches[0].toLowerCase();
			return res;
		},

		/**
		 * устанавливает текущую локаль,
		 * если аргумент не указан, то определяет имя локали по установкам броузера
		 * @param {string|object|undefined} loc имя локали или объект с локализованными сообщениями
		 * @returns {localizer}
		 */
		setLocale: function(loc){
			if(!loc){loc = this.getBrowserLocale();}

			if('string' === typeof loc){
				if(!this.locales){throw new Error('There are no pool of locales. Set localizer.locales first.');}
				if(!this.locales[loc]){
					console.warn('There are no locale set with name '+loc+'.');
					loc = this.defaultLocaleName;
					if(!this.locales[loc]){throw new Error('There are no default locale set with name '+loc+'.');}
				}

				this.transtable = this.locales[loc];
				this.localeName = loc;
			}else{
				this.transtable = loc;
			}

			return this;
		},


	};



})();

/* 
 * объект state - менеджер состояний (опций)
 * позволяет сохранять ключи и списки в localStorage, 
 * задавать значения по умолчанию
 * сохранять данные удалённо (в будущем)
 * при выдаче данных ищет сначала в remote данных, потом в локальных, потом в дефолтных
 * 
 */




	if(!window.mk){
		window.mk = { mixin:{} };
	}else if(!mk.mixin){
		/** набор миксинов
		 * @namespace mk.mixin */
		mk.mixin = {};
	}

/*
 * Примесь, дающая возможность запоминать данные объекта в localStorage
 * сериализуя эти данные в JSON
 * использование: mk.u.mixInto( objectToKeep, mk.mixin.keep );
 */


mk.mixin.keep = {
	keeped: {}, // сохраненные развернутые данные хранятся в этой переменной
	keepedKey: '_keeper_', // название ключа под которым сохраняются данные в localStorage
	copyKeepedToSelf:false, // автоматом копировать данные из keeped в сам объект (this)

	/** если задан val, то сохраняет данные пользователя в localStorage,
	 * иначе возвращает ранее сохраненное значение
	 * @param {string} key имя сохраняемой переменной
	 * @param {string} val значение
	 * @returns {Mixed} */
	keep: function(key,val){

		if(this.keepedKey === '')throw new Error('Не задан объектный ключ для localStorage');
		if(undefined === val){ return this.keeped[key];}

		this.keeped[key]=val;
		if(this.copyKeepedToSelf){ this[key]=val; }

		// в iOS бывает ограничена квота на webStorage и вылетает ошибка, которая рушит весь скрипт, нужно ловить
		try{
			localStorage.setItem( this.keepedKey,JSON.stringify(this.keeped) );
		}catch(e){
			console.warn('Не могу сохранить локальные данные. '+e.message);
		}

		return val;
	},

	/** если указан key, то удаляет из сохраненных данных ключ key
	 * если key не указан, то удаляет все сохраненные данные пользователя в localStorage
	 * @param {string} key имя удаляемого ключа
	 * @returns {Mixed} */
	keepOff:function(key){
		if(this.keepedKey === '')throw new Error('Не задан объектный ключ для localStorage');
		var ret;
		if('undefined' === typeof key){
			ret = this.keeped;
			localStorage.removeItem(this.keepedKey);
			if(this.copyKeepedToSelf){
				for(var k in this.keeped){
					if(!this.keeped.hasOwnProperty(k))continue;
					delete delete this[k]
				}
			}
			this.keeped = {};
		}else{
			if(undefined === this.keeped[key]) return undefined;
			ret = this.keeped[key];
			delete this.keeped[key];
			localStorage[this.keepedKey]=JSON.stringify(this.keeped);
			if(this.copyKeepedToSelf){ delete this[key]; }
		}

		return ret;
	},

	/** вспоминает объект this.keeped из localStorage */
	recallKeeped:function(){
		if(undefined === localStorage[this.keepedKey]) return undefined;
		this.keeped=JSON.parse(localStorage[this.keepedKey]);
		if(this.copyKeepedToSelf){ this.applyKeeped(); }
		return this.keeped;
	},

	/** применяет, то, что сохранено в объект, т.е. this.keeped.key дублируется в this.key */
	applyKeeped:function(){
		for(var key in this.keeped){
			if(!this.keeped.hasOwnProperty(key))continue;
			this[key] = this.keeped[key];
		}
	}


};

// ALIASES
mk.mixin.keep.keepoff = mk.mixin.keep.keepOff;


	if(!window.mk){
		window.mk = { mixin:{} };
	}else if(!mk.mixin){
		/** набор миксинов
		 * @namespace mk.mixin */
		mk.mixin = {};
	}

	/**
	 * набор функций для работы с событиями для примеси в другие объекты
	 * использование: mk.u.mixInto( objectToEmitEvents, mk.mixin.events );
	 * @namespace mk.mixin.events
	 */
	mk.mixin.events = {

		/**
		* Подписка на событие
		* Использование: someObject.on('click', function(event) { ... }
		* @param {string} eventTypes название события или события через пробел
		* @param {function} handler
		* @returns {undefined}
		*/
		on: function(eventTypes, handler) {
		 if (!this._eventHandlers) this._eventHandlers = {};
		 var events = eventTypes.split(' ');

		 for(var i=0; i<events.length; i++){
			 var eventType = events[i];
			if (!this._eventHandlers[eventType]) {
			  this._eventHandlers[eventType] = [];
			}
			this._eventHandlers[eventType].push(handler);
		 }
		},

		/**
		* Прекращение подписки  someObject.off('click',  handler)
		* @param {string} eventType
		* @param {function} handler
		* @returns {undefined}
		*/
		off: function(eventType, handler) {
		 var handlers = this._eventHandlers[eventType];
		 if (!handlers) return;
		 for(var i=0; i<handlers.length; i++) {
		   if (handlers[i] === handler) {
			 handlers.splice(i--, 1);
		   }
		 }
		},

		/**
		* Генерация события с передачей объекта-события
		* this.trigger('click'[, eventData]);
		* @param {string} eventType
		* @param {object} eventData
		*/
		trigger: function(eventType,eventData) {
		 // если в родительском приложении назначить строку
		 // this.eventLogTag, то будут выводиться логи
		 if(this.eventsLogTag){
			var handlersCount = (this._eventHandlers && this._eventHandlers[eventType])?this._eventHandlers[eventType].length:0;
			console.log(this.eventsLogTag+': emit '+eventType+' for '+handlersCount+' handlers');
		 }

		 if (!this._eventHandlers || !this._eventHandlers[eventType]) {
		   return; // обработчиков для события нет
		 }

		 // вызвать обработчики
		 var handlers = this._eventHandlers[eventType];
		 for (var i = 0; i < handlers.length; i++) {
		   handlers[i].call(this,eventData);
		 }


		 return this;
		},

		/**
		* псевдоним для trigger()
		* @param {string} eventType
		* @param {object} eventData
		*/
		fire: function(eventType,eventData) {
		   this.trigger(eventType,eventData);
		}
	};
/*
 * sets named css animations to selected elements
 */


(function($){
	$.cssanim = {
		useAnimationEvents:true
	};

	/**
	 * назначает элементам через стили css-анимацию, по ее завершении удаляет стили анимации
	 * @param {type} keyframesName имя ключевых кадров - директива @keyframes в CSS
	 * @param {type} options опции анимации
	 * @this {jQuery}
	 * @returns {jQuery}
	 */
	$.fn.cssanim=function(keyframesName,options){
		var o = $.extend({
			duration:0.3,
			timing:'ease-out',
			delay:0,
			iterationCount:1,
			direction:'normal',
			fillMode:'none',
			oncomplete:function(){}
		},options);
		keyframesName = keyframesName || 'mka-fade-in';
//console.log('cssanim',animationName);

		var $self = this;

		// css animation NOT allowed
		if(undefined === this.css('animationName')){

			o.oncomplete.call( this,this );
		// css animation available
		}else{
			var animStr =
					keyframesName+' '+
					o.duration+'s '+
					o.timing+' '+
					o.delay+'s '+
					o.iterationCount+' '+
					o.direction+' '+
					o.fillMode;
			this.css({
				'-webkit-animation':animStr,
					'-ms-animation':animStr,
				        'animation':animStr
			});

			// не везде нормально отрабатываются события анимации
			// на старых андроидах - то срабатывают, то нет
			if($.cssanim.useAnimationEvents){
				var AnimEnd   = 'animationend webkitAnimationEnd  MSAnimationEnd oanimationend';
				this.one(AnimEnd,function(e){
					$self.css({
							'-webkit-animation':'',
								'-ms-animation':'',
									'animation':''
					});
//console.log('cssanim oncomplete event',animationName,e.delegateTarget,o.oncomplete);
					o.oncomplete.call( $self,$self );
				});

			// если анимация есть, а события работают через анальное отверстие
			// то замена их на таймауты работает
			}else{
				setTimeout(
					function(){
//console.log('cssanim oncomplete timeout',animationName);
						$self.css({
							'-webkit-animation':'',
								'-ms-animation':'',
									'animation':''
						});
						o.oncomplete.call( $self,$self );
					},
					(o.duration+0.2)*1000
				);
			}

		}
		return this;
	};


	/**
	 * применяет css-анимацию и удаляет объект по ее окончании
	 * @param {type} animationName имя ключевых кадров - директива @keyframes в CSS
	 * @param {object} options
	 * @this {jQuery}
	 * @return {jQuery}
	 */
	$.fn.cssanimRemove=function(animationName,options){
		options = options || {};

		// оставляем элементу стили, которые получились по завершению анимации
		options.fillMode = options.fillMode || 'forwards';
		options.oncomplete = function(){
			this.remove();
		};

		this.cssanim(animationName,options);
		return this;
	};

	/**
	 * применяет css-анимацию и прячет объект по ее окончании
	 * @param {type} animationName имя ключевых кадров - директива @keyframes в CSS
	 * @param {object} options
	 * @this {jQuery}
	 * @return {jQuery}
	 */
	$.fn.cssanimHide=function(animationName,options){
		options = options || {};

		// оставляем элементу стили, которые получились по завершению анимации
		options.fillMode = options.fillMode || 'forwards';
		options.oncomplete = function(){
			this.css({display:'none'});
			//this.style.display = 'none';
		};

		this.cssanim(animationName,options);
		return this;
	};


	/** применяет css-анимацию и удаляет объект по ее окончании
	 * @deprecated вместо нее cssanimRemove
	 * @param {string} animationName
	 * @param {object} options
	 */
	$.fn.cssanimout=function(animationName,options){
		options = options || {};

		options.fillMode = options.fillMode || 'forwards';
		options.oncomplete = function(){
			this.remove();
		};

		this.cssanim(animationName,options);
	};

})(jQuery);

/**
 * data reader, data scanner, data applier
 * databridge
 * Usage:
	// apply data to DOM
	$('.selector').databridge(dataObject);
	// read data from DOM
	var dataObject = $('.selector').databridge();

 * TODO events on set get
 * TODO нужно сделать set от DOMа, а не от объекта. а то если
 * в объекте undefined то в дом ничего не ставится, а это не правильно
 * должно ставиться undefined-значение, для этого перебор должен идти по
 * ДОМу, а не по данным, будут сложности с вложенными переменными nested.var
 */


(function( $ ) {

	/** текущий корневой элемент
	 * @type jQuery */
	var _$rootEl;
	/** текущий набор подэлементов с данными (с атрибутами name)
	 * @type jQuery */
	var _$dcontainers;
	/** текущий набор с данными
	 * @type object */
	var _cdata;
	/** текущий набор чекбоксов, нужен для заполнения,
	 * т.к. они могут быть разбросаны в HTML-коде где угодно
	 * и несколько могут быть выделены.
	 * @type object */
	var _checkboxes;



	$.fn.databridge = function(data,userOptions){
		_$rootEl = this; // current root element
		_$dcontainers = _$rootEl.find('[name], [data-name]');// data containers
		_cdata = (data)?data:{}; // current data-object
		_checkboxes = {}; // scanned checkboxes names, when SET mode

		var options = $.extend({},$.fn.databridge.defaults,userOptions);

		// set data
		if(data){
			_setData(data,options);
			return this;

		// get data
		}else{
			return _getData();
		}
	};


	$.fn.databridge.defaults = {
		// use data mapping if value is undefined, works on 'set'
		mapUndefined:	false,
		// use data mapping if value is null, works on 'set'
		mapNull:		false,
		// if no data mapping, what value will be set when val is undefined
		// can be a function in mapper format
		undefinedVal:	'undefined',
		// if no data mapping, what value will be set when val is null
		// can be a function in mapper format
		nullVal:		'null'
	};

	var _setData = function(data,options){
		_$dcontainers.each(function(){
			var dataName = _dataName(this);
			var val = _extractFromNestedObj(data,dataName);
			// skip setting data if no any data exist in data-object
			if(undefined === val){return;}
			_setVal(this,val,options);
		});
	};

	var _getData = function(){
		_$dcontainers.each(function(){
			//_cdata[_dataName(this)] = _getElementVal(this);
			_assignToNestedObj( _cdata, _dataName(this), _getElementVal(this) );
		});

		return _cdata;
	};

	var _extractFromNestedObj = function(obj,propname){
		var path = propname.split('.');

		var curBranch = obj;
		var curName;
		for(var i=0; i<path.length; i++){
			curName = path[i];
			if(undefined === curBranch[curName]) return undefined;
			curBranch = curBranch[curName];
		};
		return curBranch;

	};

	/**
	 * присваивает свойству varname объекта obj значение val
	 * varname - в точечной нотации, типа person.addr.street
	 * создает в случае необходимости подобъекты person и addr
	 * @param {object} obj nested object
	 * @param {string} propname in point notation
	 * @param {mixed} val
	 * @returns {undefined}
	 */
	var _assignToNestedObj = function(obj,propname,val){
		var path = propname.split('.');

		if(1 === path.length){
			obj[ propname ] = val;
		}else{
			var curBranch = obj;
			var curName;
			for(var i=0; i<path.length; i++){
				curName = path[i];
				if(!curBranch[curName]){
					// last property in path
					if(i+1 === path.length){
						if(_isIntegerStr(curName)){
							curBranch[Number(curName)] = val;
						}else{
							curBranch[curName] = val;
						}

					// intermediate property
					}else{
						// is next (nested) index is an integer?
						curBranch[curName] = (_isIntegerStr(path[i+1]))?[]:{};
					}
				}
				curBranch = curBranch[curName];
			};
		}

	};

	var _isIntegerStr = function(val){
		return /^\d+$/.test(val);
	};

	/**
	 * значение атрибута NAME, а если его нет, то DATA-NAME
	 * @param {DOMElement} el
	 * @returns {string}
	 */
	var _dataName = function(el){
		var name = el.getAttribute('name') || el.getAttribute('data-name');
		// unify to point notation
		name = name.replace( /\[/g,'.' );
		name = name.replace( /\]/g,'' );
		return name;
	};

	// data processing ////////////////////////////////

	/**
	 * применяет мэппинг к данным перед установкой или после чтения.
	 * В функцию мэппер передаются аргументы (val,mode), this = el
	 * @param {string} mode  'set' or 'get'
	 * @param {DOMElement} el элемент с атрибутом name или data-name
	 * @param {mixed} val значение для установки или после чтения
	 * @returns {undefined}
	 */
	var _applyMapper2 = function(val,mode,el){
		var mapper = _getMapper(el);
		if(!mapper){return val;}

		return mapper.call(el, val,mode,el);
	};


	/**
	 * применяет мэппинг к данным перед установкой или после чтения.
	 * В функцию мэппер передаются аргументы (val,mode), this = el
	 * @param {mixed} val значение для установки или после чтения
	 * @param {string} mode  'set' or 'get'
	 * @param {DOMElement} el элемент с атрибутом name или data-name
	 * @param {object} options
	 * @returns {undefined}
	 */
	var _applyMapper = function(val,mode,el,options){
		var mapper;

		if(mode === 'set'){
			// undefined value
			if(undefined === val){
				if(options.mapUndefined){
					mapper = _getMapper(el);
				}else if('function' === typeof options.undefinedVal){
					mapper = options.undefinedVal;
				}else{
					val = options.undefinedVal;
				}
			// null value
			}else if(null === val){
				if(options.mapUndefined){
					mapper = _getMapper(el);
				}else if('function' === typeof options.nullVal){
					mapper = options.nullVal;
				}else{
					val = options.nullVal;
				}
			// normal value
			}else{
				mapper = _getMapper(el);
			}

		// GET mode
		}else{
			mapper = _getMapper(el);
		}

		if(mapper){val = mapper.call(el, val,mode,el);}
		return val;
	};

	/**
	 * находит и возвращает функцию мэппер
	 * @param {DOMElement} el
	 * @returns {function|null}
	 */
	var _getMapper = function(el){
		var mapperName = el.getAttribute('data-map') || el.getAttribute('data-mapper');
		if(!mapperName){return null;}
		// global function, everything is simple
		if('function' === typeof window[mapperName]){return  window[mapperName];}

		// func inside namespace like objNamespace.funcMapper
		if(/\./.test(mapperName)){
			var mapper = window;
			var indexes = mapperName.split('.');
			for(var i=0; i<indexes.length; i++){
				mapper = mapper[ indexes[i] ];
				if(undefined === mapper)break;
			}
		}else{
			var mapper = null;
		}

		if('function' !== typeof mapper){
			console.error('data-map '+mapperName+' is not a function,');
			return null;
		}

		return mapper;
	};

	// setters //////////////////////////////

	// common setter
	var _setVal = function(el,val,options){
		// map data
		val = _applyMapper(val,'set',el,options);

		var setterName;
		var tag = el.tagName.toLowerCase();

		// input element
		if('input' === tag){
			var itype = el.getAttribute('type');
			setterName = (itype && setTo[itype])?itype:'input';

		// NON input element
		}else{
			setterName = (setTo[tag])?tag:'element';
		}

		return setTo[setterName](el,val);
	};


	// particular setters
	var setTo = {

		// default setter to all inputs
		input: function(el,val){
			el.value = val;
		},

		// default setter to all NON input elements
		element: function(el,val){
			el.innerHTML = val;
		},

		// textarea uses innerHTML as inintial value.
		// Use .value to read/write instead of .innerHTML
		textarea: function(el,val){
			el.value = val;
			el.innerHTML = val;//for convenience
		},

		checkbox: function(el,val){
			if(!(val instanceof Array)){
				console.error('checkbox value must be an Array');
			}

			// обнуляем чекбоксы при первой встрече
			var dname = _dataName(el);
			if( !_checkboxes[dname] ){
				_$rootEl.find('[type=checkbox][name='+dname+']').prop('checked',false);
				_checkboxes[dname] = true;
			}

			for(var i=0;i<val.length;i++){
				if(val[i] == el.value){
					el.checked = true;
					break;
				}
			}
		},

		radio: function(el,val){
			if(val == el.value){
				el.checked = true;
			}
		},

		select:function(el,val){
			var options = el.querySelectorAll('option');

			for(var i=0;i<options.length;i++){
				if(val == options[i].value){
					options[i].selected = true;
				}else{
					options[i].selected = false;
				}
			}
		}

	};


	// getters //////////////////////////////

	// common getter
	var _getElementVal = function(el){
		var getterName;
		var tag = el.tagName.toLowerCase();

		// input element
		if('input' === tag){
			var itype = el.getAttribute('type');
			getterName = (itype && getFrom[itype])?itype:'input';

		// NON input element
		}else{
			getterName = (getFrom[tag])?tag:'element';
		}

		var val = getFrom[getterName](el);

		return _applyMapper(val,'get',el);
	};


	// particular getters
	var getFrom = {

		element: function(el){
			return el.innerHTML;
		},

		input: function(el){
			return el.value;
		},

		// textarea uses innerHTML as inintial value.
		// so use .value to read/write instead of .innerHTML
		textarea: function(el,val){
			return el.value;
		},

		checkbox: function(el){
			var cname = el.getAttribute('name');
			if(!_cdata[cname]){ _cdata[cname]=[]; }

			if(el.checked) {
				_cdata[cname].push( el.value );
			}

			return _cdata[cname];
		},

		radio: function(el){
			var cname = el.getAttribute('name');
			if(undefined === _cdata[cname]){ _cdata[cname]=''; }

			if(el.checked) {
				_cdata[cname] = el.value;
			}

			return _cdata[cname];
		},

		select:function(el){
//			if(el.selectedIndex<0)return;
//			return el.options[el.selectedIndex].value;
			return $(el).val();
		},


	};


})(jQuery);


(function($){

	var _defaults = {
		events:				false,		// Инициировать ли DOM события фильтрации
		$input:				null,		// инпут для ввода фильтра
		// HTML код инпута, если не указан существующий инпут
		inputHTML:			'<label class="mk-filter-input-wrapper"><input type="text" class="mk-filter-input" name="filter" placeholder="filter"></label>',
		attr:				'data-mk-filter',		// атрибут по которому ведется фильтрация, по нему же происходит отбор элементов подлежащим фильтрации
		// искать ли объекты для фильтрации при каждом изменении фильтра
		// если false объекты находятся и кэшируются один раз при инициализации
		reindexOnCheck:	false,
		filterClass:		'',	// добавляется к элементам подлежащим фильтрации
		failedClass:		'mk-filter-failed',		// добавляется к элементам провалившим фильтрацию
		passedClass:		'mk-filter-passed',		// добавляется к элементам прошедшим фильтрацию
		triggerName:		'keyup'
	};

	/**
	 * Создает фильтр по строке для списков
	 * @param {object|string|undefined} inputOptions опции или команда
	 * @returns {jQuery}
	 */
	$.fn.mkFilter = function(inputOptions){
		// command
		if('string' === typeof inputOptions){
			var inputs = this.data('mkFilterInputs');
			if(!inputs)throw new Error('Given element is not mkFilter.')
			switch (inputOptions){
				case 'filtrate':
					var filterStr = arguments[1];
					if(!filterStr) filterStr = '';
					_checkFilter( inputs[0].data('mkFilterOptions') );
					break;
				case 'destroy':
					_destroy(this);
					break;
				case 'reindex':
					// TODO
					break;
				default:
					throw new Error('mkFilter: unknown command '+inputOptions);
					break;
			}

		// create request
		}else{
			_create(this,inputOptions);
		}

		return this;
	};

	_create = function($root,inputOptions){
		var options = $.extend({},_defaults,inputOptions);
		// remember root, because options is attached to input,
		// one list can have several filter inputs, input have
		// only one list to filtrate
		options.$root = $root;
		// generate input if no exists
		if(!options.$input){
			options.$input = _createInput(options);
		}else{
			if(options.$input.length!==1)console.warn('mkFilter: not one input element',options.$input.length);
		}
		options.$filtrates = _indexFiltrates(options); // cache for speed
		options.$input.data('mkFilterOptions',options); // for commands
		var inputsCount = _rememberInputInRoot(options) // for 'destroy' possibilities
		options.filterIndex = inputsCount-1;
		options.handler = _onInputChange.bind(options); // remember in options for 'destroy' possibilities

		// reaction on input change
		options.$input.on(options.triggerName,options.handler);
	};

	/**
	 * remember link to input in root element
	 * @param {object} options
	 * @param {jQuery} filter
	 * @returns {integer} number of inputs for given root element
	 */
	_rememberInputInRoot = function(options){
		var inputs = options.$root.data('mkFilterInputs');
		if(!inputs){
			inputs = [];
			options.$root.data('mkFilterInputs',inputs);
		}
		return inputs.push( options.$input );
	};

	_createInput = function(options){
		var $wrapper = $(options.inputHTML).prependTo(options.$root)
console.log('_createInput',$wrapper,options)
		// input can be wrapped by html code, or not, so return INPUT
		return ($wrapper[0].tagName === 'INPUT')? $wrapper : $wrapper.find('input');
	};

	/**
	 * check for correspondence to filter
	 * @param {object} options
	 * @param {string} filter строка по которой проводится фильтрация
	 * @returns {undefined}
	 */
	_checkFilter = function(options,filter){
console.log(options)
		if(!filter){
			var filterInputStr = options.$input.val();
			filter =  new RegExp( filterInputStr,'i' );
		}
		if(options.reindexOnCheck){ options.$filtrates = _indexFiltrates(options); }

		var passed = [];
		var failed = [];
		options.$filtrates.each(function(){
			$filtrate = $(this);
			var checkStr = $filtrate.attr( options.attr );
			var passedCurrent = filter.test( checkStr );
			var passedAll = _keepCheckResultInElement(this,options,passedCurrent);

			if(passedAll){
				passed.push( $filtrate );
				$filtrate.removeClass(options.failedClass);
				$filtrate.addClass(options.passedClass);
			}else{
				failed.push( $filtrate );
				$filtrate.removeClass(options.passedClass);
				$filtrate.addClass(options.failedClass);
			}
		 });

		 if(options.events){
			var filterData = {
				string: filterInputStr,
				passed: passed,
				failed: failed,
				options: options
			}
			var event = jQuery.Event('mkFilterChange',{mkFilter:filterData});
			options.$root.triggerHandler(event);
		 }

	};

	/**
	 * Adds class to element, does not check if class is exist,
	 * and can add class multiply times,
	 * It is necessery for multiply intersecting filters
	 * @param {jQuery} $el
	 * @param {string} className
	 * @returns {undefined}
	 */
	_addClassTo = function($el,className){
		var el = $el.get(0);
		el.className += ' '+className;
	};

	/**
	 * Removes single entry of class name from element,
	 * does not use global search
	 * It is necessery for multiply intersecting filters
	 * @param {jQuery} $el
	 * @param {string} className
	 * @returns {undefined}
	 */
	_removeClassFrom = function($el,className){
		var el = $el.get(0);
		var reg = new RegExp(' '+className);
		el.className = el.className.replace(reg,'');
	};

	/**
	 * apply result of current filter check to DOMElement
	 * returns result for all checks
	 * @param	{DOMElement} el			checked element
	 * @param	{object} options		filter options
	 * @param	{boolean} passed		result of check
	 * @returns	{boolean}				logical AND for all checks
	 */
	_keepCheckResultInElement = function( el,options,passed ){
		el.mkFilterChecks[options.filterIndex] = (passed)?1:0;
		var passedAll = el.mkFilterChecks.reduce(function(prev,curr){return prev*curr;},1);
		return passedAll;
	}

	_destroy = function($root){
		var inputs = $root.data('mkFilterInputs');
		inputs.forEach(function($input){
			var options = $input.data('mkFilterOptions');
			$input.off(options.triggerName,options.handler);
			$input.data('mkFilterOptions',null);
		});
		$root.data('mkFilterInputs',null);
	};

	_reset = function(options){

	};

	_indexFiltrates = function(options){
		// find, remember and mark filtrate elements
		var $filtrates = options.$root.find('['+options.attr+']');
		$filtrates.addClass(options.filterClass);
		$filtrates.each(function(el){
			// here will be stored result of
			// filtration for multiply filters
			if(!this.mkFilterChecks)this.mkFilterChecks = [];
		});
		return $filtrates;
	};

	/**
	 * event handler for changing input
	 * @this {object} filter options
	 * @returns {undefined}
	 */
	_onInputChange = function(){
		_checkFilter( this );
	};




})(jQuery);
/*
 * @author Mihail Kantemirov
 */

(function( $ ) {

	/**
	 * $.lselect (list select) список с возможностью выбора элементов
	 *
	 * @constructor $.lselect 
	 * @param {string} selector элементы списка 
	 * @param {object} options дополнительные параметры */
	$.lselect = function(selector,options){
		if(!selector){throw new Error('Can not create lselect, because selector is empty');}

		this.options = $.extend({},this.defaults,options);
		this.selector = selector;
		this.$selectee = $( this.selector );
		this.$selectee.addClass('lselect-item');
		this.$observer = $({});  // events observer

		if(this.options.controlClass){
			this.$triggers = this.$selectee.find('.'+this.options.controlClass);
			this.$triggers.attr('onmousedown','return false;');
		}else{
			this.$triggers = null;
			this.$selectee.addClass(this.options.controlClass);
			this.$selectee.attr('onmousedown','return false;');
		}
console.log('$.lselect',this.options);
		var self = this;
		this.$selectee.on('click',function(e){self._onclick(e);});
		
	};

	$.lselect.prototype.defaults = {
		// если не null то по этому селектору внутри элемента списка будет производиться 
		// переключение выбрано-невыбрано, иначе по самим элементам списка
		controlClass:'lselect-trigger'
	};
	
	$.lselect.prototype._onclick = function(e){
		var $t = $(e.target);
		if(!$t.hasClass(this.options.controlClass))return;
		
		// снимаем выделение
		if($t.hasClass('selected')){
			$(e.target).removeClass('selected');
			if(e.delegateTarget !== e.target){
				$(e.delegateTarget).removeClass('selected');
			}		
		
		// ставим выделение
		}else{
			$(e.target).addClass('selected');
			if(e.delegateTarget !== e.target){
				$(e.delegateTarget).addClass('selected');
			}				
		}

		$(this).triggerHandler('change');
	};

	$.lselect.prototype.selectAll = function(){
		this.$selectee.addClass('selected');
		if(this.$triggers){ this.$triggers.addClass('selected'); }
	};

	$.lselect.prototype.unselectAll = function(){
		this.$selectee.removeClass('selected');
		if(this.$triggers){ this.$triggers.removeClass('selected'); }
	};

	
	$.lselect.prototype.selected  = function(){
		return this.$selectee.filter('.selected');
	};



})(jQuery);

/*
 * @author Mihail Kantemirov
 *
 *@todo сделать закрытие по кнопке "Назад" в андроиде (вообще возможно ли это??)
 */

(function( $ ) {

	/**
	 * $.mkmodal - модальный диалог с очевидным синтаксисом, CSS-анимацией и внятной AJAX-логикой.
	 * вызовы:
	 * $.mkmodal.open(options) - открыть диалог с указанными в объекте options свойствами
	 * $.mkmodal.acquire(selector[,options]) - берет содержимое диалога из CSS селектора
	 * $.mkmodal.load(url[,options]) - берет содержимое диалога из внешнего файла
	 *
	 * @fires $.mkmodal#open
	 * @fires $.mkmodal#close
	 * @fires $.mkmodal#error
	 * @fires $.mkmodal#loaderror только для команды  $.mkmodal.load()
	 * @fires $.mkmodal#loadsuccess только для команды  $.mkmodal.load()
	 *
	 * @namespace $.mkmodal*/
	$.mkmodal = {
		opened:false,
		$wrapper:null, // dom element маски с диалогом
	//	$modalMask:null, // dom element маски, для анимации
		$dialog:null, // dom element диалога, для анимации
		ticket:null // условный тикет текущего модального окна, нужен, чтобы асинхронные подгрузки
					// не переписывали окна, которые были вызваны уже после начала подгрузки
	};

	/** default options of dialog */
	$.mkmodal.defaults={
		content:'', // содержимое диалога в виде строки, или функции, возвращающей строку
		data:null, // объект с данными, в этом случае content используется как шаблон
		title:'',
		messages:{
			loadingHTML: 'Loading<b class="mka-pulse">...</b>',
			loadError: 'Can not load dialog from file ',
			aquireError: 'Can not aquire dialog from selector ',
			errorTitle: 'Dialog error'
		},
		modalHTML: '<table border="0" id="mkmodalMask"><tr><td class="mkmodal-container"><div id="mkmodal"><h2 class="mkmodal-title"></h2><a class="mkmodal-control-close"></a><div class="mkmodal-body"></div></div></td></tr></table>',
		container:null,// dom-элемент в который добавляется диалог
		_fire:'open' // какое событие выбрасывать при открытии. функции aquire и load могут поменять его на error
	};

	/** открывает диалог
	 * @param {Object} options объект с именованными опциями
	 * @returns {jQueryObject}  */
	$.mkmodal.open = function(options){
		if(this.opened){throw new Error('Can not open second mkmodal');}
		this.opened = true;
		this.ticket = (new Date()).getTime();

		// Создаём настройки по-умолчанию, расширяя их с помощью параметров, которые были переданы
		options = $.extend({}, this.defaults, options);
		var container = options.container || document.body;

		this.$wrapper = $( options.modalHTML );
		this.$wrapper.find('.mkmodal-title').html( options.title );
		this.$wrapper.find('.mkmodal-body').html( this._formatContent(options) );

		this.$dialog = this.$wrapper.find('#mkmodal');

		this.$wrapper.appendTo( container );

		// отрабатываем анимацию появления
		this._appear();

		this._initializeInterface();
		$(this).triggerHandler( options._fire );

	};

	/** закрывает диалог
	 * @fires $.mkmodal#close */
	$.mkmodal.close = function(){
		// doesnt support css animation and animation events
		if(undefined === $.mkmodal.$wrapper.css('animationName')){
			$.mkmodal.$wrapper.remove();
		}else{
			this._disappear();
		}

		this.opened = false;
		$(this).triggerHandler( 'close' );
	};

	/** открывает диалог, содержимое берет из указанного в аргументе селектора
	 * @param {string} selector jQuery селектор
	 * @param {Object} options объект с именованными опциями */
	$.mkmodal.acquire = function( selector,options ) {
		var $src = $(selector);
		var attrOpt = {
			title:$src.attr('data-mkmodal-title')
		};
		options = $.extend({}, this.defaults, attrOpt, options);

		if($src.length === 0){
			options.title = options.messages.errorTitle;
			options.content = options.messages.aquireError+selector;
			options._fire = 'error';
		}else{
			options.content = $src.html();
		}

		this.open(options);
	};


	/** открывает диалог, содержимое загружает из файла на сервере
	 * @param {string} url адрес файла
	 * @param {Object} options объект с именованными опциями
	 * @param {function} onSuccess вызывается в случае удачной загрузки
	 * @param {function} onError вызывается в случае ошибки загрузки
	 * @fires $.mkmodal#open при успешном открытии диалогового окна
	 * @fires $.mkmodal#error при ошибке загрузке контента в диалог */
	$.mkmodal.load = function( url,options,onSuccess,onError ) {
		options = $.extend({}, this.defaults, options);
		options.content = this.defaults.messages.loadingHTML;

		// открываем сразу, чтобы не было задержек загрузки
		// автоматом генерится тикет
		this.open(options);

		var self = this;
		var tic = this.ticket;
		jQuery.ajax({
			url:		url,
			success:	function(response, textStatus, jqXHR){
							if(tic !== self.ticket)return; // опоздали - окно уже закрыли и открыли другое

							options.content = response;
							var content = self._formatContent(options);

							self.$wrapper.find('.mkmodal-title').html( options.title );
							self.$wrapper.find('.mkmodal-body').html( content );
							self._initializeInterface();
							if(onSuccess) onSuccess.call(self);
							$(self).triggerHandler( 'loadsuccess' );
						},
			error:		function( jqXHR, textStatus, errorThrown ){
							if(tic !== self.ticket)return; // опоздали - окно уже закрыли и открыли другое

							options.title = options.messages.errorTitle;
							options.content = options.messages.loadError+url;

							self.$wrapper.find('.mkmodal-title').html( options.title );
							self.$wrapper.find('.mkmodal-body').html( options.content );
							if(onError) onError.call(jqXHR, textStatus, errorThrown);

							$(self).triggerHandler( 'loaderror' );
						},
			async:true
		});
	};


	$.mkmodal._initializeInterface = function(){
		this.$dialog.find('.mkmodal-close,.mkmodal-control-close').one( 'click', function(e){$.mkmodal.close( );}  );
		this.$dialog.on( 'click', function(e){e.stopPropagation();});
		// В некоторых броузерах (на андроиде) обнаружился глюк, который автоматически
		// закрывает диалог, если на маске стоит обработчик onclick.close
		// ставим onclick.close уже после отработки анимации появления
		setTimeout(function(){
			$.mkmodal.$wrapper.on( 'click', function(){$.mkmodal.close();} );
		},300);

	};

	/** выставляет маске размеры экрана. Т.к. iOS вместо height:100% лепит какую-то ерунду
	 *
	 */
	$.mkmodal._unfoldMask = function(){

	};

	/** формирует контент в виде строки. Т.к. контент может быть в виде функции или шаблона
	 *
	 * @param {object} options
	 * @returns {string}
	 */
	$.mkmodal._formatContent = function(options){
		var content = ('function' === typeof options.content)?options.content():options.content;
		if(options.data){content = this._insertData(content,options.data);}

		return content;
	};

	$.mkmodal._appear = function(){
		var o = {

		};
		this.$wrapper.cssanim('mka-fade-in');
		this.$dialog.cssanim('mka-ascent-in');
	};

	$.mkmodal._disappear = function($dialog){
		this.$dialog.cssanim('mka-drown-out');
		this.$wrapper.cssanimRemove('mka-fade-out');
	};


	/** устанавливает положение для диалога
	 *  @param {jQueryObject} $dialog */
	$.mkmodal._centrate = function($dialog){
		// calculate left top corner to centrate $dialog
		var $window = $(window);
		var x = ($window.width()-$dialog.width())/2;
		var y = ($window.height()-$dialog.height())/2;
		if(x<0){x=0;}
		if(y<0){y=0;}

		$dialog.css('left',x+'px' );
		$dialog.css('top',y+'px' );
	};

//	$.mkmodal._moveToCenter = function($dialog){
//		var pos = this._getposition($dialog);
//		$dialog.animate({
//			opacity: 1,
//			left: pos.x,
//			top	: pos.y
//			}, 300, function() {
//				// Animation complete.
//		});
//	};

	/** заполняет строку данными из объекта
	 * @param {string} dialogContent строка типа "value is: %val%."
	 * @param {Array} data объект с данными */
	$.mkmodal._insertData = function(dialogContent,data){
		if(data === null){return dialogContent;}
		if(!dialogContent){
			console.warn('dialog content is empty');
			return dialogContent;
		}

		for(var k in data){
			if(!data.hasOwnProperty(k))continue;
			var regexp = new RegExp('%'+k+'%','g');
			dialogContent = dialogContent.replace(regexp,data[k]);
		}

		return dialogContent;

	};

	/** заполняет строку данными из объекта или нескольких объектов
	 * @param {string} template строка-шаблон, типа "value is: %val%."
	 * @param {Array} data объект с данными, их может быть несколько через запятую */
	 $.mkmodal._strRender = function(template,data) {
		placeholdStartMarker = placeholdEndMarker = '%';

		for(var i=1; i<arguments.length; i++){
			data = arguments[i];
			for(var k in data){
				if(!data.hasOwnProperty(k))continue;
				var regexp = new RegExp(placeholdStartMarker+k+placeholdEndMarker,'g');
				template = template.replace(regexp,data[k]);
			}
		}

		return(template);
	};


})(jQuery);

// initialization at the end of file

(function( $ ) {

	/**
	 * @event $#pagex#open
	 * @event $#pagex#close
	 * @event $#pagex#load
	 * @property {string} targetPageAlias псевдоним целевой страницы
	 * @property {DOMElement} targetPageElement DOM-элемент целевой страницы
	 * @event $#pagex#error
	 * @property {string} targetPageAlias псевдоним целевой страницы
	 * @property {DOMElement} targetPageElement DOM-элемент целевой страницы
	 * @property {string} errorThrown
	 */

	/**
	* $.pagex - модуль для загрузки страниц через jQuery.AJAX.
	* Подразумевается, что есть одно рабочее поле (тэг), в которое грузится контент.
	* Связывает адрес в хэше и подгружаемый контент.
	* @author Mihail Kantemirov <mkant@list.ru>
	* @version 2.1.2
	*
	* @namespace $.pagex
	* @fires $#pagex#open
	* @fires $#pagex#close
	* @fires $#pagex#load
	* @fires $#pagex#error
	* */
	$.pagex = {
		/** ссылка на DOM элемент-конейнер
		 * @type {jQueryCollection} */
		$container:null,
		/**  префикс к псевдониму страниц
		 * @type {string} */
		prefix:'screens/',
		/** окончание к псевдониму страниц
		 * @type {string}*/
		postfix:'.html',
		/**   что показывать пока грузится контент в страницу
		 * @type {string}*/
		loadingPage:'<div class="mka-fade-in">Loading<b class="mka-pulse">...</b></div>',
		/** что показывать в случае ошибки загрузки
		 * @type {string} */
		errorMessage:'Невозможно загрузить страницу',
		/** по какому псевдониму грузить контент, когда хэш пустой
		 * @type {string} */
		defaultPage:'home',
		/** на теги с этим атрибутом будут привязаны переходы со страницы на страницу
		 * @type {string} */
		goAttribute:'data-pagex-go',
		/** псевдоним текущей страницы
		 * @type {string} */
		currentPage:null,
		prevPage:null,
		// стэк переходов до текущей страницы @type {array}
		stack:[],
		/** степень десяти,dc *.
		 * @type {integer} */
		cacheNumber:3,
		debug:true,
		/** если true, то закрытые страницы не удаляются, а прячутся
		 * @type {boolean} */
		cache:true,
		/** объект описывающий анимацию смены страниц. Если равен null то анимации нет.
		 * @type {object}
		 * @prop {number} $.pagex.animation.duration длительность анимации в секундах
		 * @prop {string} $.pagex.animation.forwardIn имя css-кейфреймов для анимации появления страницы при листании вперед
		 * @prop {string} $.pagex.animation.forwardOut уход страницы при листании вперед
		 * @prop {string} $.pagex.animation.backIn появление страницы при листании назад
		 * @prop {string} $.pagex.animation.backOut уход страницы при листании назад
		 * */
		animation:{
			on:true,
			duration:0.3,// в секундах
			forwardIn:'slide-in-from-right',
			forwardOut:'slide-out-to-left',
			backIn:'slide-in-from-left',
			backOut:'slide-out-to-right'
		},

		_forward:true, // направление листания
		_$curPageEl:null, // объект страницы на которую идем
		_changing:false, // страницы находятся в процессе листания
		_wrapperClass:'pagex-page',
		_containerID:'pageContainer',
		// общие обработчики событий, срабатывающие при любом открытии/закрытии/ошибке
		_eventHandlers:{
			open:[],
			load:[],
			close:[],
			error:[]
		},
		// именнованные обработчики событий, привязанные к конкретным страницам
		_namedHandlers:{
			open:{},
			load:{},
			close:{},
			error:{}
		}

	};

	/** привязывается к событию hashchange, что необходимо для работы модуля */
	$.pagex.init = function(){
//console.log('body.onhashchange',window.onhashchange);
		$(window).on('hashchange',function(){ $.pagex.onHashChange(); });
		this.$container = $( document.getElementById(this._containerID) );
		if(this.$container.length === 0){
			console.warn('pagex: page container does not exist with selector: #'+this._containerID);
			this.$container = null;
		}else{
			var pos = this.$container.css('position');
			if( pos!=='relative' &&  pos!=='absolute' &&  pos!=='fixed'){
				console.warn('pagex: page container has unreliable style.position property, better use "relative","absolute" or "fixed".');
			}
		}
	};

	/** осуществляет начальную загрузку страницы, когда зашли на адрес с хэшем,
	 * т.е. события hashchange нет, а хэш есть
	 * не включен в pagex.init, т.к. к инициации может быть не подгружен контейнер */
	$.pagex.initPageLoad = function(){
		var hash = this.extractHashAlias();
		if(hash){
			this._loadContent(hash);
		}
	};

	/** вносит необходимые стили, чтобы не таскать за собой отдельный файл CSS */
	$.pagex.setStyles = function(){
		var $pagexStylesTag = $('#pagexStyles');
		if($pagexStylesTag.length === 0){
			$pagexStylesTag = $('<style id="pagexStyles"></style>').appendTo(document.head);
		}

		var	st =  '#pageContainer{position:relative;}';
			st += '#pageContainer .pagex-page{position:absolute; top:0; left:0; width:100%; min-height:100%; box-sizing:border-box;}';
		$pagexStylesTag.html(st);
	};

	$.pagex.onHashChange = function(){
		var pageAlias = $.pagex.extractHashAlias();
		if(!pageAlias) pageAlias = this.defaultPage;

		//this.watchStack(pageAlias);
		if(this.currentPage){this.prevPage = this.currentPage;}

		// watch stack
		if(pageAlias === this.lastStack()){
			this._forward = false;
			this.stack.pop();
		}else{
			this._forward = true;
			if(this.prevPage){this.stack.push(this.prevPage);}
		}
		$.pagex._loadContent( pageAlias );
	};

	/** генерирует ссылку на загружаемую страницу из чистого хэша (без знака #)
	 * @param {string} pageAlias псевдоним страницы, из которого вычисляется адрес */
	$.pagex.getContentLink = function(pageAlias){
		// адрес страницы с тикетом для запрета кэширования
		return this.prefix+pageAlias+this.postfix+'?'+this.cacheTicket(this.cacheNumber);
	};

	/** изменяет анкор, вызывая подгрузку контента
	 * @param {string} pageAlias название страницы без расширения файла */
	$.pagex.open = function(pageAlias){
		// анкор изменен на тот же, что и был - принудительно грузим контент.
		if(this.currentPage === pageAlias || this.extractHashAlias() === pageAlias){
			this._loadContent(pageAlias,true);

		}else{
			// только меняем анкор, событие onhashchange вызовет подгрузку контента.
			window.location.hash = pageAlias;
		}
	};

	$.pagex.back = function(){
		window.history.back();
	};

	/** возвращает псевдоним предыдущей страницы
	 * @return {(string|null)} */
	$.pagex.lastStack = function(){
		if(this.stack.length === 0)return null;
		return this.stack[ this.stack.length-1 ];
	};

	/** загружает контент в заданный контейнер по хэш-псевдониму
	 * @param {string} pageAlias имя файла без префикса и постфикса
	 * @param {boolean} skipAnimation пропустить анимацию */
	$.pagex._loadContent = function(pageAlias, skipAnimation){
		if('string' !== typeof pageAlias)throw new Error('Псевдоним страницы должен быть строкой, а не '+(typeof pageAlias));
		if(pageAlias === this.currentPage){ return; }

		// для анимации критично запомнить состояние
		this._changing = true;

		// событие закрытия страницы (если есть, что закрывать)
		if(this.currentPage){
			this.triggerSet('close',this.currentPage);
		}

		// меняем страницы -----
		// активная страница становится уходящей
		var $outPage = this._$curPageEl;
		// меняем текущую страницу
		this.currentPage = pageAlias;

		// пытаемся найти новую активную страницу в кэше
		this._$curPageEl = $.pagex._findPage(pageAlias);

		// есть в кэше
		if(this._$curPageEl){
			this._$curPageEl.css('display','');
			// в кэше есть, но была ошибка загрузки
			if(this._$curPageEl.hasClass('pagex-load-error')){
				this._$curPageEl.html(this.loadingPage);
				this._loadFile(pageAlias,this.currentPage);
				// не инициируем событие open - это сделает _loadFile
			}else{
				this.triggerSet('open',this.currentPage);
			}
		// в кэше нет - создаем и подгружаем
		}else{
			this._$curPageEl = $('<div></div>')
				.attr('class',this._wrapperClass)
				.attr('id',pageAlias)
				.html(this.loadingPage)
				.appendTo(this.$container);
			//this._loadFile(pageAlias,this.currentPage);
			this._loadFile(pageAlias,this.currentPage);
		}

		// отрабатываем анимацию смены страниц -----
		if(this.animation.on && !skipAnimation){
			var animOutOptions={
				duration:this.animation.duration,
				fillMode: 'forwards', // оставляем спрятанным после анимации
				oncomplete:function(){
					/** @this {jQuery} */
					$.pagex._removePageElement(this);
				}
			};
			var animInOptions={
				duration:this.animation.duration,
				oncomplete:function(){
					$.pagex._changing = false;
					// в случае резких переключений (кнопка back) может залипнуть и остаться невидимым
					$.pagex._$curPageEl.css('display','');
				}
			};

			var animIn,animOut;
			if(this._forward){
				animIn = this.animation.forwardIn;
				animOut = this.animation.forwardOut;
			}else{
				animIn = this.animation.backIn;
				animOut = this.animation.backOut;
			}

			this._$curPageEl.cssanim(animIn,animInOptions);
			if($outPage){ $outPage.cssanim(animOut,animOutOptions); }

		// без анимации просто удаляем нафиг старую страницу
		}else{
			if($outPage){ $.pagex._removePageElement( $outPage ); }
			$.pagex._changing = false;
		}
	};

	/**
	 * убирает - прячет или удаляет страницу
	 * @param {jQuery} $pageElement
	 */
	$.pagex._removePageElement = function($pageElement){
		// кэшируем страницу - только прячем ее, не удаляя из DOM
		if(this.cache){
			$pageElement.css('display','none');
		// удяляем элемент страницы из DOM
		}else{
			$pageElement.remove();
		}
	};

	/**
	 *
	 * @param {string} pageAlias
	 */
	$.pagex._loadFile =function(pageAlias){
		// если где-то cors был true, оставляем true
		jQuery.support.cors = jQuery.support.cors || this.cors;

		// запоминаем текущий currentPage, т.к. из-за долгой загрузки может смениться
		// страница и загруженную с опозданием не нужно будет вставлять
		var self = this;
		jQuery.ajax({
			url:		this.getContentLink(pageAlias),
			data:		{},
			method:		'GET',
			dataType:	'text',
			crossDomain:	jQuery.support.cors,
			success:	function(response, textStatus, jqXHR){
							self._printContent(response, pageAlias, true);
						//	self.onLoad(pageAlias);
						//	self.onEnd(pageAlias);

							self.triggerSet('load',pageAlias);
							self.triggerSet('open',pageAlias);
						},
			error:		function( jqXHR, textStatus, errorThrown ){
						//	self.onError( jqXHR, textStatus, errorThrown );
							self._printContent(self.loadErrorMessage(errorThrown), pageAlias, false);
						//	self.onEnd(pageAlias);

							self.triggerSet('error',pageAlias,{errorThrown:errorThrown});
						},
			async:   	true
		});
	};

	$.pagex.loadErrorMessage = function(errorThrown){
		if(this.debug){
			return this.errorMessage+'<br />url: '+this.getContentLink(this.currentPage)+'<br />error thrown: '+errorThrown;
		}else{
			return this.errorMessage;
		}
	};

	/**
	 * "впечатывает" строку в DOM в элемент-контейнер
	 * @param {string} content наполнение для страницы
	 * @param {string} forPage псевдоним страницы, для которой предназначен контент
	 * @param {boolean} loadIsSuccesfull успешна ли подрузка контента
	 * @returns {undefined}
	 */
	$.pagex._printContent = function(content,forPage,loadIsSuccesfull){
		if(undefined === loadIsSuccesfull){
			loadIsSuccesfull = true;
		}

		//this.$container.innerHTML = content; // не отрабатываются скрипты
		if(this.cache){
			// при долгой загрузке currentPage может уже поменяться
			var $p = this._findPage(forPage);
			if(!$p){ return; }
			$p.html(content);
			if(!loadIsSuccesfull){ $p.addClass('pagex-load-error'); }
		}else{
			// при долгой загрузке currentPage может уже поменяться
			if(forPage!==this.currentPage){return; }
			this._$curPageEl.html(content);
			if(!loadIsSuccesfull){ this._$curPageEl.addClass('pagex-load-error'); }
		}


	};

	/**
	 * ищет DOM-элемент страницы в контейнере страниц
	 * @param {string} pageAlias
	 * @returns {JQuery|null}
	 */
	$.pagex._findPage = function(pageAlias){
		//pageAlias может оказаться некорректным id типа path/to, поэтому нужны кавычки
		var $el = this.$container.find('[id="'+pageAlias+'"]');
		return ($el.length)? $el : null;
	};

	/** извлекает чистый хэш из адреса */
	$.pagex.extractHashAlias = function(){
		if(window.location.hash === '')return('');
		return window.location.hash.substr(1);
	};


	/** создает число для добавления к URL чтобы предотвратить кэширование
	 * при загрузке страниц содержимого
	 * @param {integer} orderOfMagnitude степень десяти, например 1 - кэшируется на 10 секунд, 3 - на 1000 секунд */
	$.pagex.cacheTicket = function(orderOfMagnitude){
		if(undefined === orderOfMagnitude) orderOfMagnitude = 3;
		return Math.floor( (new Date()).getTime()/Math.pow(10, orderOfMagnitude+3) );
	};

	/**
	 * вешает на клик открывание страницы, если у элементов
	 * есть специальный атрибут, заданный в $.pagex.goAttribute, по умолчанию data-pagex-go
	 * @param {DOMElement} containerElement
	 */
	$.pagex.bind = function(containerElement){
		if(undefined === containerElement){
			containerElement = document;
		}

		$('['+this.goAttribute+']',containerElement).on('click', $.pagex.openOnEvent);
	};

	/**
	 * EventListener, который открывает страницу, вызывается не самостоятельно,
	 * а назначается элементым через .on('click'), адрес берет из атрибута
	 * @param {event} e
	 * @returns {undefined}
	 */
	$.pagex.openOnEvent = function(e){
		if('object' !== typeof(e.delegateTarget)) return;
		// достаем алиас из атрибута
		var pageAlias=$(e.delegateTarget).attr( jQuery.pagex.goAttribute );
		$.pagex.open(pageAlias);
	};

	/**
	 * Назначает обработчик события объекту $.pagex
	 * если вызвано полностью - $.pagex.on(eventType,pageAlias,handler), то событие
	 * будет отрабатываться только когда event.targetPageAlias == pageAlias.
	 * Если вызвано без указания pageAlias - $.pagex.on(eventType,handler),
	 * то событие будет срабатывать на любой странице
	 *
	 * @param {string} eventType имя события
	 * @param {string} pageAlias псевдоним страницы
	 * @param {function} handler обработчик события
	 */
	$.pagex.on = function(eventType,pageAlias,handler){
		// именованные обработчики
		if('string' === typeof pageAlias){
			if('function' !== typeof handler){throw new Error('$.pagex.on(): event handler is not a function!');}
			if(!this._namedHandlers[eventType][pageAlias]){
				this._namedHandlers[eventType][pageAlias] = [];
			}
			this._namedHandlers[eventType][pageAlias].push( handler );
		// общие обработчики
		}else if('function' === typeof pageAlias){
			handler = pageAlias;
			this._eventHandlers[eventType].push( handler );
		// что-то напутано с типами аргументов
		}else{
			throw new Error('$.pagex.on(): wrong type of arguments');
		}
	};

	/**
	 * убирает ранее назначенный обработчик события. pageAlias можно опустить:
	 * $.pagex.off(eventType,handler) - убирает общие обработчики
	 * $.pagex.off(eventType,pageAlias,handler) - убирает обработчики конкретных страниц
	 * @param {string} eventType имя события
	 * @param {string} pageAlias псевдоним страницы
	 * @param {function} handler обраотчик события
	 */
	$.pagex.off = function(eventType,pageAlias,handler){
		var handlers;
		// именованные обработчики
		if('string' === typeof pageAlias){
			handlers = this._namedHandlers[eventType][pageAlias];
			if(!handlers){return;}

		// общие обработчики
		}else if('function' === typeof pageAlias){
			handlers = this._eventHandlers[eventType];
			if(!handlers){return;}
			handler = pageAlias;

		// что-то напутано с типами аргументов
		}else{
			throw new Error('$.pagex.off(): wrong type of arguments');
		}

		// удаляем из списка обработчик
		for(var i=0; i<handlers.length; i++) {
			if (handlers[i] === handler) {
				handlers.splice(i--, 1);
			}
		}
	};

	/**
	 * вызывает 2 обработчика объекта $.pagex,
	 * один для конкретной страницы, второй общий.
	 * В целях безопасности нужно всегда указывать pageAlias
	 * иначе возможны ошибки при асинхронной загрузке
	 * @param {string} eventType имя события
	 * @param {string} pageAlias псевдоним страницы
	 * @param {object} additionalData дополнительная информация, передаваемая в событие
	 */
	$.pagex.triggerSet = function(eventType,pageAlias,additionalData){
		this.triggerNamed(eventType,pageAlias,additionalData);
		this.triggerUnnamed(eventType,pageAlias,additionalData);
	};


	/**
	 * вызывает обработчик конкретной страницы объекта $.pagex,
	 * в целях безопасности нужно всегда указывать pageAlias
	 * иначе возможны ошибки при асинхронной загрузке
	 * @param {string} eventType имя события
	 * @param {string} pageAlias псевдоним страницы
	 * @param {object} additionalData дополнительная информация, передаваемая в событие
	 */
	$.pagex.triggerNamed = function(eventType,pageAlias,additionalData){
		if(!pageAlias){throw new Error('$.pagex.triggerNamed(): pageAlias is obligatory');}

		var handlers = this._namedHandlers[eventType][pageAlias];
		if(!handlers){return;}

		// формируем объект события
		var event = this.event(eventType,pageAlias,additionalData);

		// вызываем обработчики
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].call(this, event);
		}
	};


	/**
	 * формирует объект события
	 * @param {string} eventType имя события
	 * @param {string} pageAlias псевдоним страницы
	 * @param {object} additionalData дополнительная информация, передаваемая в событие
	 */
	$.pagex.event = function(eventType,pageAlias,additionalData){
		var event = additionalData || {};
		event.type = eventType;
		event.pageAlias = pageAlias;
		event.pageElement = this._findPage(pageAlias).get(0);
		event.delegateTarget = event.targetPageElement;
		event.target = this;

		return event;
	};

	/**
	 * вызывает общий обработчик события объекта $.pagex,
	 * в целях безопасности нужно всегда указывать pageAlias
	 * иначе возможны ошибки при асинхронной загрузке
	 * @param {string} eventType имя события
	 * @param {string} pageAlias псевдоним страницы
	 * @param {object} additionalData дополнительная информация, передаваемая в событие
	 */
	$.pagex.triggerUnnamed = function(eventType,pageAlias,additionalData){
		if(!pageAlias){throw new Error('$.pagex.triggerNamed(): pageAlias is obligatory');}

		// общие обработчики
		var handlers = this._eventHandlers[eventType];
		if(!handlers){return;}

		// формируем объект события
		var event = this.event(eventType,pageAlias,additionalData);

		// вызываем обработчики
		for (var i = 0; i < handlers.length; i++) {
			handlers[i].call(this, event);
		}
	};

})(jQuery);


// не следует помещать этот вызов в начале файла - это не надежно.
// Если тэг скрипт с вызовом этого файла генерируется скриптом
// то этот вызов отрабатывается тут же ПЕРЕД инициацией класса, т.к. DOM уже загружен
// а не как ожидается - ждет загрузки  DOM и срабатывает только после инициации класса $.pagex
$(function(){
	// INITIATE pagex ---
	$.pagex.init();
});
/*
 * простейший рендер строк по объекту с даными.
 * simpleRender('my name is %name%',{name:MIKE}) === 'my name is MIKE'
 */

(function() {

	var startMark = '%';
	var endMark = '%';

	// external functions ////////////////////////////////

	/**
	 * заменяет в строке плейсхолдеры данными, например
	 * simpleRender('my name is %name%',{name:MIKE}) === 'my name is MIKE'
	 * Если указано несколько дата-объектов, то шаблон рендерится всеми объектами,
	 * при совпадении ключей в объектах остается значение из первого объекта.
	 * Если указан массив с однотипными дата-объектами, то шаблон размножается
	 * в соответствии с количеством дата-объектов
	 * @param {string} template строка с плейсхолдерами
	 * @param {object|array} data объект с данными или массив объектов
	 * @returns {String}
	 */
	simpleRender = function(template,data){
		// рендер по нескольким дата-объектам
		if(arguments.length > 2){
			return _renderByObjects.apply(this,arguments);
		}
		// рендер по массиву дата-объектов
		if(data instanceof Array){
			return _renderByArray(template,data);
		};
		// рендер по одному дата-объекту
		return _renderByData(template,data);
	};

	/**
	 * вычищает из строки плейсхолдеры для данных
	 * @param {string} str строка с плейсхолдерами
	 * @param {string} replaceStr строка на замену, по умолчанию пустая строка
	 * @returns {string}
	 */
	clearSimplePlaceholders = function(str,replaceStr){
		var regexp = new RegExp(startMark+'.+?'+endMark,'g');
		if(!replaceStr){replaceStr='';}
		return str.replace(regexp,replaceStr);
	};

	/**
	 * устанавливает маркеры начала и конца плейсхолдера и возвращает их.
	 * Если указано 2 аргумента, первый - это startMark, второй - endMark.
	 * Если только один аргумент оба маркера устанавливаются одинаковыми.
	 * Если не указывать аргументов, то возвращает текущие маркеры.
	 *
	 * @returns {Array} массив рабочих маркеров - [startMark,endMark]
	 */
	simpleMarks = function(){
		// both start and end marks
		if(arguments.length = 2){
			startMark = arguments[0];
			endMark = arguments[1];
		// one arg - equal marks
		}else if(arguments.length = 1){
			startMark = arguments[0];
			endMark = arguments[0];
		}

		return [startMark,endMark];
	};


	// shortcuts ////////////////////////////////////////

	// method to String.prototype
	if(!String.prototype.simpleRender){
		String.prototype.simpleRender = function(){
			// add THIS to arguments
			var myargs = [this];
			for(var i=0; i<arguments.length; i++){
				myargs.push(arguments[i]);
			}
			return simpleRender.apply(this,myargs);
		};
	}else{
		console.warn('String.simpleRender() already exists.');
	}
	if(!String.prototype.clearSimplePlaceholders){
		String.prototype.clearSimplePlaceholders = function(replaceStr){
			return clearSimplePlaceholders(this,replaceStr);
		};
	}else{
		console.warn('String.clearSimplePlaceholders() already exists.');
	}

	// private functions //////////////////////////////////

	/** render string by data object
	 *  @param {string} tpl template
	 *  @param {object} data key:value data-object
	 *  @returns {string}
	 */
	var _renderByData = function(tpl,data){
		for(var k in data){
			if(!data.hasOwnProperty(k))continue;
			var regexp = new RegExp(startMark+k+endMark,'g');
			tpl = tpl.replace(regexp,data[k]);
		}

		return(tpl);
	};

	/** render string by several data objects, specified as arguments after tpl
	 *  @param {string} tpl template
	 *  @returns {string}
	 */
	var _renderByObjects = function(tpl){
		for(var i=1; i<arguments.length; i++){
			tpl = _renderByData(tpl,arguments[i]);
		}
		return tpl;
	};

	/** render string by array of data objects
	 *  @param {string} tpl template
	 *  @param {array} arr array of key:value data-objects
	 *  @returns {string}
	 */
	var _renderByArray = function(tpl,arr){
		var res = '';
		for(var i=0; i<arr.length; i++){
			res += _renderByData(tpl,arr[i]);
		}
		return res;
	};


})();

	if(!window.mk){
		mk = {};
	}

	mk.drawer = {};
	
	mk.drawer.defaults = {
		content:null,	// содержимое ящика. Текст или DOM Element
		class:	null,	// css класс ящика
		overlay:true	// перекрывать ли маской под меню
	};

	mk.drawer.addClass = function(o,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(o.className)) {return;}
		o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};

	mk.drawer.removeClass = function(o,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};
	
	
	mk.drawer.hasClass = function(o,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		return re.test(o.className);
	};
	
	mk.drawer.normalizeOptions = function(options){
		if(undefined === options){options = {};}
		for(var k in this.defaults){
			if(!this.defaults.hasOwnProperty*(k)){continue;}
			if(undefined !== options[k]){continue;}
			
			options[k] = this.defaults[k];
		}
		return options;
	};

	mk.drawer.toggle = function(drawerEl){
		var wrapper = drawerEl; // drawer container
		var body = wrapper.querySelector('.mk-drawer-body'); // drawer body
		var overlay = wrapper.drawerOptions.overlay;
		// Close
		if (this.hasClass(wrapper,'mk-open')){
			this.removeClass(wrapper,'mk-open');
			if(overlay){
				this.removeClass(overlay,'mk-open');
			}

			// убираем когда закончится анимация
			setTimeout(function(){ 
				body.style.display = 'none';
				if(overlay){
					overlay.style.display = 'none';
				}
			},350);
		// Open
		}else{
			body.style.display = '';
			mk.drawer.addClass(wrapper,'mk-open');
			if(overlay){
				overlay.style.display = '';	
				setTimeout(function(){mk.drawer.addClass(overlay,'mk-open');},20);
			}
		}
	};
	
	mk.drawer.create = function(content,options){
		if(content.ownerDocument !== document && 'object' === typeof content){
			options = content;
			options = mk.drawer.normalizeOptions(options);
			content = options.content;
		}else{
			options = mk.drawer.normalizeOptions(options);
		}
		if(!content){
			console.error('No content supplied for drawer');
			return;
		}
		
		var wrapper = document.createElement('div');
		wrapper.className = 'mk-drawer-wrapper';
		if(options.class){ wrapper.className += ' '+ options.class;}
		//wrapper.style.right = '0px';
		
		wrapper.drawerOptions = {};
		
		

		var drPouch = document.createElement('div');
		drPouch.className = 'mk-drawer-pouch';
		

		var drBody = document.createElement('div');
		drBody.className = 'mk-drawer-body';
		drPouch.appendChild(drBody);
		
		// content is DOM Element
		if(content.ownerDocument === document){
			var drParent = this._defineParent(content);
			drBody.appendChild(content);
		
		// content is probably string
		}else{
			drBody.innerHTML = content;
			var drParent = document.body;
		}
		
		if(document.body === drParent){
			wrapper.style.position = 'fixed';
		}

		if(options.overlay){
			var overlay = drParent.querySelector('.mk-drawer-overlay');
			
			if(!overlay){
				overlay = document.createElement('div');
				overlay.className = 'mk-drawer-overlay';
				overlay.style.display = 'none';
				overlay.onclick = function(){
					var openedWrapper = this.parentNode.querySelector('.mk-drawer-wrapper.mk-open');
					mk.drawer.toggle(openedWrapper);
				};
				// must be appended to parent, not to wrapper, to eclipse parent
				drParent.appendChild(overlay);
			}
			
			wrapper.drawerOptions.overlay = overlay;
			if(document.body === drParent){
				overlay.style.position = 'fixed';
			}
		}
		
		

		var trigger = document.createElement('button');
		trigger.className = 'mk-drawer-trigger';
		trigger.onclick = function(){mk.drawer.toggle(this.parentNode);};
		trigger.innerHTML = '<span class="mk-drawer-icon mk-icon-close"></span>';
		
		wrapper.appendChild(trigger);
		wrapper.appendChild(drPouch);

		drParent.appendChild(wrapper);
		return wrapper;
	};

	/**
	 * находит родительский элемент для drawer и добавляет к нему нужные атрибуты
	 * @param {DOMElement} contentEl drawer content element
	 * @returns {DOMElement}
	 */
	mk.drawer._defineParent = function(contentEl){
		var p = contentEl.parentNode;
		var pos = p.style.position;
		if('fixed' !== pos && 'relative' !== pos && 'absolute' !== pos){
			p.style.position = 'relative';
		}
		
		return p;
	};

/**
 * mobile-alike slide menu
 */

	if(!window.mk){ mk = {}; }

	mk.slidemenu = {};

	mk.slidemenu.defaults = {
		backButtonContent: 'Back',
		className:'',
		width:null,
		height:null
	};

	mk.slidemenu.gointo = function(triggerEl){
		var root = mk.slidemenu.getRoot(triggerEl);
		var parentLi = triggerEl.parentNode;
		var parentUl = parentLi.parentNode;
		var ulToGointo = parentLi.querySelector('ul');

		// put sublist to slidemenu root
		root.appendChild(ulToGointo);
		// remove hide-class in next tick
		setTimeout(function(){mk.u.removeClass(ulToGointo,'mk-away-right');},20);

		// hide parent
		mk.u.addClass(parentUl,'mk-away-left');
	};

	mk.slidemenu.goback = function(triggerEl){
		var parentLi = triggerEl.parentLi; // old place of ul
		var parentUl = parentLi.parentNode;
		var subList = triggerEl.parentNode.parentNode;
		
		mk.u.removeClass(parentUl,'mk-away-left');
		mk.u.addClass(subList,'mk-away-right');
		// move UL to old place after animation
		setTimeout(function(){parentLi.appendChild(subList);},500);
	};

	mk.slidemenu.getRoot = function(el){
		var curEl = el;
		var className = 'mk-slidemenu-container';

		while(!mk.u.hasClass(curEl,className)){
			curEl = curEl.parentNode;
			if(document === curEl){ console.error('slidemenu container did not found.'); break;}
		}
		return curEl;
	};
	
	mk.slidemenu.prepend = function(parentEl,childEl){
		parentEl.insertBefore( childEl,parentEl.childNodes[0] );
	};

	mk.slidemenu.create = function(listEl,options){
		options = mk.u.merge(mk.slidemenu.defaults,options);

		var wrapper = mk.u.wrap(listEl,'div',{class:'mk-slidemenu-container'});
		if(options.className){ wrapper.className += ' '+options.className; }
		if(options.width){ wrapper.style.width = options.width; }
		if(options.height){ wrapper.style.height = options.height; }

		mk.slidemenu.processList(listEl,options);
		return wrapper;
	};
	
	mk.slidemenu.processList = function(listEl,options){
		// find all inner ULs
		var ULs = listEl.querySelectorAll('ul');
		for(var i=0; i<ULs.length;i++){
			var UL = ULs[i];
			mk.u.addClass(UL.parentNode,'mk-has-children');
			mk.u.addClass(UL,'mk-away-right');


			// find A trigger in parent LI
			var a = UL.parentNode.querySelector('a');
			if(!a || UL.parentNode !== a.parentNode){
				console.error('can not create slide-trigger, because no A tag inside LI tag',UL.parentNode);
				continue;
			}
			a.onclick = function(){ mk.slidemenu.gointo(this); };
			
			mk.slidemenu.prependBackButton(UL,options.backButtonContent);
		}
	};
	
	mk.slidemenu.prependBackButton = function(ul,backButtonContent){
		// button exists, do nothing
		if('mk-slidemenu-back' === ul.childNodes[0].className){return;}

		// create back button
		var bb = document.createElement('li');
		var ba = document.createElement('a');
		bb.className = 'mk-slidemenu-back';
		ba.innerHTML = backButtonContent;
		ba.parentLi = ul.parentNode;
		ba.onclick = function(){ mk.slidemenu.goback(ba); };
		bb.appendChild(ba);

		mk.slidemenu.prepend(ul,bb);
	};