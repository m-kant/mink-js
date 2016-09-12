

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