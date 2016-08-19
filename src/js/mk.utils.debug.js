
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