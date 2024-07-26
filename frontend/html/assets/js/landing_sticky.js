$(window).scroll(function() {
    if ($(this).scrollTop() > 200){  
        $('header').addClass("sticky");
    }
    else{
        $('header').removeClass("sticky");
    }
});

new WOW().init();