
	if(!window.mk){
		mk = {};
	}

	mk.drawer = {};
	
	mk.drawer.defaults = {
		content:null,	// содержимое ящика. Текст или DOM Element
		class:	null,	// css класс ящика
		overlay:true	// перекрывать ли маской под меню
	};

	mk.drawer.addClass = function(o,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(o.className)) {return;}
		o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};

	mk.drawer.removeClass = function(o,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	};
	
	
	mk.drawer.hasClass = function(o,c){
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		return re.test(o.className);
	};
	
	mk.drawer.normalizeOptions = function(options){
		if(undefined === options){options = {};}
		for(var k in this.defaults){
			if(!this.defaults.hasOwnProperty*(k)){continue;}
			if(undefined !== options[k]){continue;}
			
			options[k] = this.defaults[k];
		}
		return options;
	};

	mk.drawer.toggle = function(drawerEl){
		var wrapper = drawerEl; // drawer container
		var body = wrapper.querySelector('.mk-drawer-body'); // drawer body
		var overlay = wrapper.drawerOptions.overlay;
		// Close
		if (this.hasClass(wrapper,'mk-open')){
			this.removeClass(wrapper,'mk-open');
			if(overlay){
				this.removeClass(overlay,'mk-open');
			}

			// убираем когда закончится анимация
			setTimeout(function(){ 
				body.style.display = 'none';
				if(overlay){
					overlay.style.display = 'none';
				}
			},350);
		// Open
		}else{
			body.style.display = '';
			mk.drawer.addClass(wrapper,'mk-open');
			if(overlay){
				overlay.style.display = '';	
				setTimeout(function(){mk.drawer.addClass(overlay,'mk-open');},20);
			}
		}
	};
	
	mk.drawer.create = function(content,options){
		if(content.ownerDocument !== document && 'object' === typeof content){
			options = content;
			options = mk.drawer.normalizeOptions(options);
			content = options.content;
		}else{
			options = mk.drawer.normalizeOptions(options);
		}
		if(!content){
			console.error('No content supplied for drawer');
			return;
		}
		
		var wrapper = document.createElement('div');
		wrapper.className = 'mk-drawer-wrapper';
		if(options.class){ wrapper.className += ' '+ options.class;}
		//wrapper.style.right = '0px';
		
		wrapper.drawerOptions = {};
		
		

		var drPouch = document.createElement('div');
		drPouch.className = 'mk-drawer-pouch';
		

		var drBody = document.createElement('div');
		drBody.className = 'mk-drawer-body';
		drPouch.appendChild(drBody);
		
		// content is DOM Element
		if(content.ownerDocument === document){
			var drParent = this._defineParent(content);
			drBody.appendChild(content);
		
		// content is probably string
		}else{
			drBody.innerHTML = content;
			var drParent = document.body;
		}
		
		if(document.body === drParent){
			wrapper.style.position = 'fixed';
		}

		if(options.overlay){
			var overlay = drParent.querySelector('.mk-drawer-overlay');
			
			if(!overlay){
				overlay = document.createElement('div');
				overlay.className = 'mk-drawer-overlay';
				overlay.style.display = 'none';
				overlay.onclick = function(){
					var openedWrapper = this.parentNode.querySelector('.mk-drawer-wrapper.mk-open');
					mk.drawer.toggle(openedWrapper);
				};
				// must be appended to parent, not to wrapper, to eclipse parent
				drParent.appendChild(overlay);
			}
			
			wrapper.drawerOptions.overlay = overlay;
			if(document.body === drParent){
				overlay.style.position = 'fixed';
			}
		}
		
		

		var trigger = document.createElement('button');
		trigger.className = 'mk-drawer-trigger';
		trigger.onclick = function(){mk.drawer.toggle(this.parentNode);};
		trigger.innerHTML = '<span class="mk-drawer-icon mk-icon-close"></span>';
		
		wrapper.appendChild(trigger);
		wrapper.appendChild(drPouch);

		drParent.appendChild(wrapper);
		return wrapper;
	};

	/**
	 * находит родительский элемент для drawer и добавляет к нему нужные атрибуты
	 * @param {DOMElement} contentEl drawer content element
	 * @returns {DOMElement}
	 */
	mk.drawer._defineParent = function(contentEl){
		var p = contentEl.parentNode;
		var pos = p.style.position;
		if('fixed' !== pos && 'relative' !== pos && 'absolute' !== pos){
			p.style.position = 'relative';
		}
		
		return p;
	};
