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
