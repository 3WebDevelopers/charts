$(function() {
    setInterval(function(Hash){
        $('.active').removeClass('active');
        $('li a[href="'+window.location.hash+'"]').parent().addClass('active');
    },100)
});