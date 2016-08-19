


test( "mk.u.makedate()", function() {
	var now = new Date();
	var str;

	str = now.format('dd.mm.yyyy HH:MM:ss:l');
	equal(mk.u.makedate(str).getTime(), now.getTime(), str );

	str = now.format('dd.mm.yyyy HH:MM:ss');
	equal(String(mk.u.makedate(str)), String(now), str );

	now.setSeconds(0);
	str = now.format('dd.mm.yyyy HH:MM');
	equal(String(mk.u.makedate(str)), String(now), str );

	now.setHours(0,0);
	str = now.format('dd.mm.yyyy');
	equal(String(mk.u.makedate(str)), String(now), str );

	now.setDate(1);
	str = now.format('mm.yyyy');
	equal(String(mk.u.makedate(str)), String(now), str );

	///////////////////////////////////////////////////////////

	now = new Date();
	str = now.format('yyyy-mm-dd HH:MM:ss:l');
	equal(mk.u.makedate(str).getTime(), now.getTime(), str );

	str = now.format('yyyy-mm-dd HH:MM:ss');
	equal(String(mk.u.makedate(str)), String(now), str );

	now.setSeconds(0);
	str = now.format('yyyy-mm-dd HH:MM');
	equal(String(mk.u.makedate(str)), String(now), str );


	now.setHours(0,0);
	str = now.format('yyyy-mm-dd');
	equal(String(mk.u.makedate(str)), String(now), str );

	now.setDate(1);
	str = now.format('yyyy-mm');
	equal(String(mk.u.makedate(str)), String(now), str );

	///////////////////////////////////////////////////////////
	
	now = new Date();
	str = now.format('HH:MM:ss:l');
	equal(mk.u.makedate(str).getTime(), now.getTime(), str );
	
	str = now.format('HH:MM:ss');
	equal(String(mk.u.makedate(str)), String(now), str );
	
	now.setSeconds(0);
	str = now.format('HH:MM');
	equal(String(mk.u.makedate(str)), String(now), str );

});