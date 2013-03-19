$(function() {
     setInterval(function(Hash){
		var target = window.location.hash.split('/').slice(0,2).join('/');
        $('.active').removeClass('active');
		if(target == '#/') $('li a[href="'+target+'"]').parent().addClass('active');
		else $('li a[href^="'+target+'"]').parent().addClass('active');
    },100) 
});

