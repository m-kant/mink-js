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