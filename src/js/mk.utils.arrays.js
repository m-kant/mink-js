

	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}


	/**
	 * есть ли в массиве arr значение val
	 * @param {Array} arr
	 * @param {Mixed} val
	 * @returns {Boolean}
	 */
	mk.u.isInArray = function(arr,val) {
		for(var i=0; i<arr.length;i++){
			if (arr[i] === val) return true;
		}
		return false;
	};

	/**
	 * возвращает объект из массива объектов,
	 * в котором el.fieldName = fieldVal
	 * @param {array} arr
	 * @param {string} fieldName
	 * @param {mixed} fieldVal
	 * @returns {mixed}
	 */
	mk.u.getFromArray = function(arr,fieldName,fieldVal) {
	   var res;
	   for(var i=0; i<arr.length; i++){
		   if( fieldVal === arr[i][fieldName] ){
			   res = arr[i];
			   break;
		   }
	   }
	   return res;
	};


	/** добавляет значение в конец массива, только в том случае, если такого значения в массиве нет
	 * @param {Array} arr массив, в который добавляем елемент
	 * @param {Mixed} val значение, которое не должно повторяться в массиве, может быть несколько через запятую
	 * @return {Number} новая длина массива */
	mk.u.pushUnique = function(arr,val){
		for(var i=1; i<arguments.length;i++){
			val = arguments[i];
			if( mk.u.isInArray(arr,val) )return arr.length;
			arr.push(val);
		}
		return arr.length;
	};

	/** удаляет из массива элемент с указанным значением
	 * @param {Array} arr массив, из которого удаляем елемент
	 * @param {Mixed} val значение, которое нужно удалить, может быть несколько через запятую
	 * @return {Number} новая длина массива */
	mk.u.removeValFromArray = function(arr,val){
		for(var i=1; i<arguments.length;i++){
			val = arguments[i];
			var idx = arr.indexOf(val);
			if( -1 === idx )continue;
			arr.splice(idx,1);
		}
		return arr.length;
	};


