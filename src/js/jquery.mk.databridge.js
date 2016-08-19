/**
 * data reader, data scanner, data applier
 * databridge
 *
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