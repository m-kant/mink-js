


	function createList($el,n){
		var str = '';
		var id;
		for(var i=0; i<n; i++){

			id = rndEL()+intRnd(1000,9999);
			str += "<div data-mk-filter='"+id+"'>Element "+id+"</div>";
		}
		$el.html(str);
	}

	function rnd(min, max) {
	   return Math.random() * (max - min) + min;
	};

	function intRnd(min, max) {
	   return Math.round( rnd(min, max) );
	};

	function rndEL(){
		var s = 'abcdefghiklmnopqrstuvwxyz';
		var i = intRnd(0,s.length-1);
		return s[i];
	};
