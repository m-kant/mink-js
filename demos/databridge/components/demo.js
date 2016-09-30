
	readData = function(source,target){
		var data = $(source).databridge();
		console.log('databridge READ:',data);
		target.value = JSON.stringify(data,null,'  ');
	};

	setData = function(source,target){
		var dataStr = source.value;
		var data = JSON.parse(dataStr);

		console.log('databridge SET:',dataStr,data);
		$(target).databridge(data);
	};

	dateMap = function(val,mode){
		if(mode === 'set'){
			return (new Date(val)).format('dd.mm.yyyy');
		}else{
			return mk.u.makedate(val).getTime();
		}
	};

	millageMap = function(val,mode){
		if(mode === 'set'){
			return val/1000;
		}else{
			return val*1000;
		}
	};

	rateMap = function(val,mode){
		if(val < 4){
			this.style.backgroundColor = '#FCDEE6';
		}else if(val < 7){
			this.style.backgroundColor = '#FCFCD4';
		}else{
			this.style.backgroundColor = '#CEF2CE';
		}
		return val;
	}