$(function() {

    function loadHashHandler(){
        console.log("Loading hash handler...");
        if ("onhashchange" in window) {
            console.log("Event binded...");
            window.onhashchange = function () {
                showActive(window.location.hash);
            }
        }else { // event not supported:
            var storedHash = window.location.hash;
            console.log("Event not binded going into fallback...");
            window.setInterval(function () {
                if (window.location.hash != storedHash) {
                    storedHash = window.location.hash;
                    showActive(storedHash);
                }
            }, 100);
        }
    }

    function showActive(){
        $('.active').removeClass('active');
        $('li a[href="'+window.location.hash+'"]').parent().addClass('active');
    }

    loadHashHandler();
});