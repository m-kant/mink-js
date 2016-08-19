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
