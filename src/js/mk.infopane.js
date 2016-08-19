
(function(){

	if(!window.mk)window.mk = {};

	var _counter = 0; // used to assign id's
	var _que = []; // queue of message DOMElements

	var _erase = function(id){
		if(!_que[id])return; // already does not exist

		var msgEl = _que[id];
		msgEl.className += ' msg-hide';
		delete _que[id];

		setTimeout(function(){
			msgEl.parentNode.removeChild(msgEl);
		},1000);
	};


	mk.Infopane = function(targetEl){
		this.target = (targetEl)? _addClass( targetEl, 'infopane' ) : _createTarget();
	};

	mk.Infopane.prototype = {

		defaults:{
			type:'default',
			duration:3000, // 0 means infinite
			closeBut:true
		},

		print: function(msg,options){
			var options = _extend({},this.defaults,options);
			var id = _counter++;
			// to save in dom element
			options.messageId = id;
			options.pane = this;

			var msgEl = document.createElement('div');
			msgEl.className = 'infopane-msg msg-appear msg-'+options.type;
			msgEl.infopaneMessageOptions = options;
			msgEl.innerHTML = '<div class="msg-body">'+msg+'</div>';
			//msgEl.innerHTML = msg;
			_que[id] = msgEl;// cache shortcut

			if(options.closeBut){
				var closeBut = document.createElement('div');
				closeBut.className = 'msg-close';
				closeBut.onclick = function(){ mk.Infopane.erase(id); };
				msgEl.appendChild(closeBut);
			}

			this._prependTarget(msgEl);

			if(options.duration){
				setTimeout(function(){
					mk.Infopane.erase(id);
				},options.duration);
			}

			// remove appear animation
			setTimeout(function(){ _removeClass(msgEl,'msg-appear') ; },1000);
			this.onPrint.call(this,id);
			return id;
		},

		onPrint: function(messageId){},
		onErase: function(messageId){}, // dont know how cos erase is independent from panel instance

		count: function(){
			var count={common:0};
			var self = this;
			_que.forEach(function(msgEl,id){
				var mopts = msgEl.infopaneMessageOptions;
				if(mopts.pane !== self)return;
				count.common++;
				var type = mopts.type;
				if(!count[type])count[type]=0;
				count[type]++;
			});
			return count;
		},

		erase: _erase, // local instance alias



		/**
		 * добавляет в панель сообщение в стиле по умолчанию
		 * @param {string} msg текст сообщения
		 * @param {number|boolean} arg1 duration или флажок closeBut
		 * @param {number|boolean} arg2 duration или флажок closeBut
		 */
		echo:function(msg,arg1,arg2){
			var options = this._buildOptions(arg1,arg2);
			options.type = 'default';
			return this.print(msg,options);
		},

		/**
		 * присваивает значения опций для duration и closeBut в зависимости от типа аргументов
		 * @param {number|boolean} arg1 duration или флажок closeBut
		 * @param {number|boolean} arg2 duration или флажок closeBut
		 */
		_buildOptions:function(arg1,arg2){
			var options = {};

			if('number' === typeof arg1){
				options.duration = arg1;
			}else if('number' === typeof arg2){
				options.duration = arg2;
			}else{
				options.duration = this.defaults.duration;
			}

			if('boolean' === typeof arg1){
				options.closeBut = arg1;
			}else if('boolean' === typeof arg2){
				options.closeBut = arg2;
			}else{
				options.closeBut = true;
			}

			return options;
		},

		/**
		 * добавляет в панель сообщение об успехе
		 * @param {string} msg текст сообщения
		 * @param {number|boolean} arg1 duration или флажок closeBut
		 * @param {number|boolean} arg2 duration или флажок closeBut
		 */
		ok:function(msg,arg1,arg2){
			var options = this._buildOptions(arg1,arg2);
			options.type = 'ok';
			return this.print(msg,options);
		},
		/**
		 * добавляет в панель сообщение с предупреждением
		 * @param {string} msg текст сообщения
		 * @param {number|boolean} arg1 duration или флажок closeBut
		 * @param {number|boolean} arg2 duration или флажок closeBut
		 */
		warn:function(msg,arg1,arg2){
			var options = this._buildOptions(arg1,arg2);
			options.type = 'warn';
			return this.print(msg,options);
		},
		/**
		 * добавляет в панель сообщение с ошибкой
		 * @param {string} msg текст сообщения
		 * @param {number|boolean} arg1 duration или флажок closeBut
		 * @param {number|boolean} arg2 duration или флажок closeBut
		 */
		err:function(msg,arg1,arg2){
			var options = this._buildOptions(arg1,arg2);
			options.type = 'err';
			return this.print(msg,options);
		},
		/**
		 * добавляет в панель информационное сообщение
		 * @param {string} msg текст сообщения
		 * @param {number|boolean} arg1 duration или флажок closeBut
		 * @param {number|boolean} arg2 duration или флажок closeBut
		 */
		info:function(msg,arg1,arg2){
			var options = this._buildOptions(arg1,arg2);
			options.type = 'info';
			return this.print(msg,options);
		},


		_prependTarget: function(el){
			var firstEl = this.target.firstChild;
			if(firstEl){
				this.target.insertBefore(el,firstEl);
			}else{
				this.target.appendChild(el);
			}

		}

	};

	mk.Infopane.erase = _erase; // static alias

	mk.Infopane.update = function(id,message){
		if(!_que[id])return; // already does not exist
		var msgEl = _que[id];
		msgEl.querySelector('.msg-body').innerHtml = message;
	};

	var _createTarget = function(){
		var target = document.createElement('div');
		target.className = 'infopane';
		document.body.appendNode(target);
		return target;
	};

	var _addClass = function(el,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(el.className)) {return;}
		el.className = (el.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		return el;
	};

	var _removeClass = function(el,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		el.className = el.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};

	var _extend = function(target,mixin){
		for(var i=1; i<arguments.length; i++){
			mixin = arguments[i];
			for(var k in mixin){
				if(!mixin.hasOwnProperty(k)) continue;
				target[k] = mixin[k];
			}
		}
		return target;
	};

})();