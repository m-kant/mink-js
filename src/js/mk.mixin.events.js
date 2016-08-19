

	if(!window.mk){
		window.mk = { mixin:{} };
	}else if(!mk.mixin){
		/** набор миксинов
		 * @namespace mk.mixin */
		mk.mixin = {};
	}

	/**
	 * набор функций для работы с событиями для примеси в другие объекты
	 * использование: mk.u.mixInto( objectToEmitEvents, mk.mixin.events );
	 * @namespace mk.mixin.events
	 */
	mk.mixin.events = {

		/**
		* Подписка на событие
		* Использование: someObject.on('click', function(event) { ... }
		* @param {string} eventTypes название события или события через пробел
		* @param {function} handler
		* @returns {undefined}
		*/
		on: function(eventTypes, handler) {
		 if (!this._eventHandlers) this._eventHandlers = {};
		 var events = eventTypes.split(' ');

		 for(var i=0; i<events.length; i++){
			 var eventType = events[i];
			if (!this._eventHandlers[eventType]) {
			  this._eventHandlers[eventType] = [];
			}
			this._eventHandlers[eventType].push(handler);
		 }
		},

		/**
		* Прекращение подписки  someObject.off('click',  handler)
		* @param {string} eventType
		* @param {function} handler
		* @returns {undefined}
		*/
		off: function(eventType, handler) {
		 var handlers = this._eventHandlers[eventType];
		 if (!handlers) return;
		 for(var i=0; i<handlers.length; i++) {
		   if (handlers[i] === handler) {
			 handlers.splice(i--, 1);
		   }
		 }
		},

		/**
		* Генерация события с передачей объекта-события
		* this.trigger('click'[, eventData]);
		* @param {string} eventType
		* @param {object} eventData
		*/
		trigger: function(eventType,eventData) {
		 if (!this._eventHandlers || !this._eventHandlers[eventType]) {
		   return; // обработчиков для события нет
		 }

		 // вызвать обработчики
		 var handlers = this._eventHandlers[eventType];
		 for (var i = 0; i < handlers.length; i++) {
		   handlers[i].call(this,eventData);
		 }

		 return this;
		},

		/**
		* псевдоним для trigger()
		* @param {string} eventType
		* @param {object} eventData
		*/
		fire: function(eventType,eventData) {
		   this.trigger(eventType,eventData);
		}
	};