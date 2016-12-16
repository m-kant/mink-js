
$(function(){
	navTop();
});

function navTop(){
	$(topNavEl).load('../!components/demo-top-nav.html',navList);
}

function navList(){
	var navStr = '';
	$.getJSON('../!components/config.json',function(conf){
		conf.structure.forEach(function(item){
			navStr += navItem(item,conf.baseUrl);
		});

		$('.mink-demos-nav').html(navStr);
	});

}

function navItem(item,baseUrl){
	var urlpath = window.location.pathname;
	urlpath = urlpath.replace(/\/$/,'');
	var folder = item.folder;
	var name =item.name || folder;
	var active = (urlpath.substr(-1*folder.length) === folder )?'class="active"':'';
console.log(urlpath.substr(-1*folder.length),folder)
	return '<li '+active+'><a href="'+baseUrl+folder+'">'+name+'</a></li>';
}