

(function($){

	var _defaults = {
		events:		false,			// Инициировать ли DOM события фильтрации
		$input:		null,			// инпут для ввода фильтра
		attr:		'data-mk-filter',// атрибут по которому ведется фильтрация, по нему же происходит отбор объектов фильтрации
		filterClass: 'mk-filter-affected',
		failedClass: 'mk-filter-failed',
		onPass:		null,		// функция ($el,filterStr) this=options, применяемая к объектам, прошедшим фильтр
		onFail:		null		// функция ($el,filterStr) this=options, применяемая к объектам, НЕ прошедшим фильтр
	};


	$.fn.mkFilter = function(inputOptions){
		var options = $.extend({},_defaults,inputOptions);
		if(!options.$input) _createInput(this);
		options.$filtrates = _findFiltrates(this,options);
		options.$filterRoot = this;

		// remember options in input element
		options.$input.data('mkFilterOptions',options);
		// remember in root element that it's a filter with link to input
		this.data('mkFilterInput',options.$input);
		// reaction on input change
		options.$input.on('keyup',_onKeyUp);

		return this;
	};

	_createInput = function($filterRootEl){

	};

	/**
	 * check for correspondence to filter
	 * @param {object} options
	 * @returns {undefined}
	 */
	_checkFilter = function(options){
		var filterInputStr = options.$input.val();
		var filter =  new RegExp( filterInputStr,'i' );

		 options.$filtrates.each(function(){
			 var $this = $(this);
			 var filterStr = $this.attr( options.attr );
			 if(filter.test( filterStr )){
				$this.removeClass( options.failedClass );
				if(options.onPass)options.onPass.call(options,$this,filterInputStr);
				// events only on filtrate elements, not container
				if(options.events) $this.triggerHandler('filterPass',{filter:filterInputStr});
			 }else{
				$this.addClass( options.failedClass );
				if(options.onFail)options.onFail.call(options,$this,filterInputStr);
				if(options.events) $this.triggerHandler('filterFail',{filter:filterInputStr});
			 }
		 });
	};

	_destroy = function($filterRootEl){

	};

	_reset = function($filterRootEl){

	};

	_findFiltrates = function($filterRootEl,options){
		// find, remember and mark filtrate elements
		var $filtrates = $filterRootEl.find('['+options.attr+']');
		$filtrates.addClass(options.filterClass);
		return $filtrates;
	};

	_onKeyUp = function(e){
		_checkFilter( $(e.target).data('mkFilterOptions') );
	};




})(jQuery);