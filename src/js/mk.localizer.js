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
