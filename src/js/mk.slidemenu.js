/**
 * mobile-alike slide menu
 */

	if(!window.mk){ mk = {}; }

	mk.slidemenu = {};

	mk.slidemenu.defaults = {
		backButtonContent: 'Back',
		className:'',
		width:null,
		height:null
	};

	mk.slidemenu.gointo = function(triggerEl){
		var root = mk.slidemenu.getRoot(triggerEl);
		var parentLi = triggerEl.parentNode;
		var parentUl = parentLi.parentNode;
		var ulToGointo = parentLi.querySelector('ul');

		// put sublist to slidemenu root
		root.appendChild(ulToGointo);
		// remove hide-class in next tick
		setTimeout(function(){mk.u.removeClass(ulToGointo,'mk-away-right');},20);

		// hide parent
		mk.u.addClass(parentUl,'mk-away-left');
	};

	mk.slidemenu.goback = function(triggerEl){
		var parentLi = triggerEl.parentLi; // old place of ul
		var parentUl = parentLi.parentNode;
		var subList = triggerEl.parentNode.parentNode;
		
		mk.u.removeClass(parentUl,'mk-away-left');
		mk.u.addClass(subList,'mk-away-right');
		// move UL to old place after animation
		setTimeout(function(){parentLi.appendChild(subList);},500);
	};

	mk.slidemenu.getRoot = function(el){
		var curEl = el;
		var className = 'mk-slidemenu-container';

		while(!mk.u.hasClass(curEl,className)){
			curEl = curEl.parentNode;
			if(document === curEl){ console.error('slidemenu container did not found.'); break;}
		}
		return curEl;
	};
	
	mk.slidemenu.prepend = function(parentEl,childEl){
		parentEl.insertBefore( childEl,parentEl.childNodes[0] );
	};

	mk.slidemenu.create = function(listEl,options){
		options = mk.u.merge(mk.slidemenu.defaults,options);

		var wrapper = mk.u.wrap(listEl,'div',{class:'mk-slidemenu-container'});
		if(options.className){ wrapper.className += ' '+options.className; }
		if(options.width){ wrapper.style.width = options.width; }
		if(options.height){ wrapper.style.height = options.height; }

		mk.slidemenu.processList(listEl,options);
		return wrapper;
	};
	
	mk.slidemenu.processList = function(listEl,options){
		// find all inner ULs
		var ULs = listEl.querySelectorAll('ul');
		for(var i=0; i<ULs.length;i++){
			var UL = ULs[i];
			mk.u.addClass(UL.parentNode,'mk-has-children');
			mk.u.addClass(UL,'mk-away-right');


			// find A trigger in parent LI
			var a = UL.parentNode.querySelector('a');
			if(!a || UL.parentNode !== a.parentNode){
				console.error('can not create slide-trigger, because no A tag inside LI tag',UL.parentNode);
				continue;
			}
			a.onclick = function(){ mk.slidemenu.gointo(this); };
			
			mk.slidemenu.prependBackButton(UL,options.backButtonContent);
		}
	};
	
	mk.slidemenu.prependBackButton = function(ul,backButtonContent){
		// button exists, do nothing
		if('mk-slidemenu-back' === ul.childNodes[0].className){return;}

		// create back button
		var bb = document.createElement('li');
		var ba = document.createElement('a');
		bb.className = 'mk-slidemenu-back';
		ba.innerHTML = backButtonContent;
		ba.parentLi = ul.parentNode;
		ba.onclick = function(){ mk.slidemenu.goback(ba); };
		bb.appendChild(ba);

		mk.slidemenu.prepend(ul,bb);
	};