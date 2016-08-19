

	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}


	mk.u.toBoolean = function(val) {
		if('boolean' === typeof val)	return val;
		if('number' === typeof val)		return Boolean(val);
		if(null === val || undefined === val) return false;
		if(val instanceof Array)		return Boolean(val.length);
		if('object' === typeof val)		return Boolean( mk.u.objectLength(val) );
		if('string' !== typeof val)		return Boolean(val);

		val = val.trim();
		switch(val){
			case '':
				return false;
			case 'false':
				return false;
			case 'true':
				return true;
			case '0':
				return false;
			case '1':
				return true;
			default:
				return true;
		}
	};

