
	if(!window.mk){
		window.mk = { u:{} };
	}else if(!mk.u){
		/** mk utilites. Утилиты общего назначения для раоты с DOM
		 * @namespace mku */
		mk.u = {};
	}

	/** вывод строки на экран, шоткат к alert
	 * или можно переопределить через свое модальное окно
	 * @param {string} msg
	 * @returns {undefined} */
	mk.u.p = function(msg){
		//alert(msg);
		$.mkmodal.open({content:msg});
	};


	/** оформляет сообщение об ошибке через mk.u.p всплывающего окна-алерта
	 * @param {Error} e */
	mk.u.err = function(e){
		// это фонгеп чудит выбрасывая event.type=error вместо Error object
		// TODO хорошо бы разобраться
		if(undefined !== e.bubbles) return;

		$.mkmodal.open({title:'Ошибка',content:e});
		//alert('error: '+e);
	};

	/** выводит Exception
	 * @param {error} e */
	mk.u.ex = function(e){
		// это фонгеп чудит выбрасывая event.type=error вместо Error object
		// TODO хорошо бы разобраться
		//if(undefined !== e.bubbles) return;

		$.mkmodal.open({title:'Exception',content:e.message});
		if(mk.u._isDebug()){ console.error(e); }

	};


	/**
	 * обработчик ошибок для window.onerror
	 * @param {string} msg
	 * @param {string} url
	 * @param {string} line
	 * @returns {undefined}
	 */
	mk.u.windowOnError = function(msg, url, line){
		if(mk.u._isDebug()){
			mk.u.err( msg+'<br />line: '+line+'<br />url: '+url );
			console.error('window.onerror: '+msg+'<br />line: '+line+'<br />url: '+url);
		}else{
			mk.u.err( msg );
		}
	};

