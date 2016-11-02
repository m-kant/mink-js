	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}


	/** Длина объекта
	 * @param {Object} o объект */
	mk.u.objectLength = function(o){
		if(null === o) return;
		if(undefined === o) return;

		var length = 0;
		for(var i in o){
			if(o.hasOwnProperty(i)){length++;}
		}
		return length;
	};


	/**
	 * merges two or more objects
	 * @returns {object}
	 */
	mk.u.merge = function(){
		if(0 === arguments.length){return {};}

		var res = {};
		for(var i=0; i<arguments.length; i++){
			var obj = arguments[i];
			for(var k in obj){
				if(!obj.hasOwnProperty(k)){continue;}

				if('object' === typeof obj[k]){
					if('object' !== typeof res[k]){
						res[k] = {};
					}
					res[k] = mk.u.merge(res[k],obj[k]);
				}else{
					res[k] = obj[k];
				}
			}
		}

		return res;
	};


	/** Замешивает в первый объект свойства и методы из объекта mixin
	 * может быть указано несколько mixin - объектов через запятую
	 * @param {Object} target объект, в который осуществляется примесь
	 * @param {Object} mixin объект, свойства которого нужно внедрить, может быть несколько штук */
	mk.u.mixInto = function(target,mixin){
		for(var i=1; i<arguments.length; i++){
			mixin = arguments[i];
			for(var k in mixin){
				if(!mixin.hasOwnProperty(k)) continue;
				target[k] = mixin[k];
			}
		}
		return target;
	};
	/** Замешивает в первый объект свойства и методы из объекта mixin
	 * может быть указано несколько mixin - объектов через запятую
	 * !!! если в целевом объекте уже есть свойство из mixin объекта,
	 * то остается целевое, из миксина не вставляется
	 * @param {Object} target объект, в который осуществляется примесь
	 * @param {Object} mixin объект, свойства которого нужно внедрить, может быть несколько штук */
	mk.u.mixUniqueInto = function(target,mixin){
		var skipped = [];
		for(var i=1; i<arguments.length; i++){
			mixin = arguments[i];
			for(var k in mixin){
				if(!mixin.hasOwnProperty(k)) continue;
				if(target[k] !== undefined){ skipped.push(k); continue;}
				target[k] = mixin[k];
			}
		}
		if(skipped.length) console.warn('Duplicating properties were skipped while mixing: '+skipped.join(', '));
		return target;
	};

	/**
	 * Наследование класса Child от класса Parent
	 * @param {function} Child конструктор дочернего класса
	 * @param {function} Parent конструктор родительского класса
	 * @returns {undefined}
	 */
 	mk.u.extendClass = function(Child, Parent) {
		var F = function() { };
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.prototype.superclass = Parent.prototype;
	};


	mk.u.clone = function(obj){
		// 'for' is much faster then 'JSON.parse( JSON.stringify(obj) )'
		var res;
		if( obj instanceof Array){
			res = [];
			for(var i=0; i<obj.length; i++){
				if('object' === typeof obj[i] && null !== obj[i]){
					res.push( mk.u.clone(obj[i]) );
				}else{
					res.push(obj[i]);
				}
			}
		}else{
			res = {};
			for(var i in obj){
				if(!obj.hasOwnProperty(i))continue;
				if('object' === typeof obj[i] && null !== obj[i]){
					res[i] = mk.u.clone(obj[i]);
				}else{
					res[i] = obj[i];
				}
			}
		}
		return res;
	};

