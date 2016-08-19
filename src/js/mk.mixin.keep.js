
	if(!window.mk){
		window.mk = { mixin:{} };
	}else if(!mk.mixin){
		/** набор миксинов
		 * @namespace mk.mixin */
		mk.mixin = {};
	}

/*
 * Примесь, дающая возможность запоминать данные объекта в localStorage
 * сериализуя эти данные в JSON
 * использование: mk.u.mixInto( objectToKeep, mk.mixin.keep );
 */


mk.mixin.keep = {
	keeped: {}, // сохраненные развернутые данные хранятся в этой переменной
	keepedKey: '_keeper_', // название ключа под которым сохраняются данные в localStorage
	copyKeepedToSelf:false, // автоматом копировать данные из keeped в сам объект (this)

	/** если задан val, то сохраняет данные пользователя в localStorage,
	 * иначе возвращает ранее сохраненное значение
	 * @param {string} key имя сохраняемой переменной
	 * @param {string} val значение
	 * @returns {Mixed} */
	keep: function(key,val){

		if(this.keepedKey === '')throw new Error('Не задан объектный ключ для localStorage');
		if(undefined === val){ return this.keeped[key];}

		this.keeped[key]=val;
		if(this.copyKeepedToSelf){ this[key]=val; }

		// в iOS бывает ограничена квота на webStorage и вылетает ошибка, которая рушит весь скрипт, нужно ловить
		try{
			localStorage.setItem( this.keepedKey,JSON.stringify(this.keeped) );
		}catch(e){
			console.warn('Не могу сохранить локальные данные. '+e.message);
		}

		return val;
	},

	/** если указан key, то удаляет из сохраненных данных ключ key
	 * если key не указан, то удаляет все сохраненные данные пользователя в localStorage
	 * @param {string} key имя удаляемого ключа
	 * @returns {Mixed} */
	keepOff:function(key){
		if(this.keepedKey === '')throw new Error('Не задан объектный ключ для localStorage');
		var ret;
		if('undefined' === typeof key){
			ret = this.keeped;
			localStorage.removeItem(this.keepedKey);
			this.keeped = {};
		}else{
			if(undefined === this.keeped[key]) return undefined;
			ret = this.keeped[key];
			delete this.keeped[key];
			localStorage[this.keepedKey]=JSON.stringify(this.keeped);
		}

		return ret;
	},

	/** вспоминает объект this.keeped из localStorage */
	recallKeeped:function(){
		if(undefined === localStorage[this.keepedKey]) return undefined;
		this.keeped=JSON.parse(localStorage[this.keepedKey]);
		if(this.copyKeepedToSelf){ this.applyKeeped(); }
		return this.keeped;
	},

	/** применяет, то, что сохранено в объект, т.е. this.keeped.key дублируется в this.key */
	applyKeeped:function(){
		for(var key in this.keeped){
			if(!this.keeped.hasOwnProperty(key))continue;
			this[key] = this.keeped[key];
		}
	}


};

// ALIASES
mk.mixin.keep.keepoff = mk.mixin.keep.keepOff;