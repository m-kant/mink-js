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