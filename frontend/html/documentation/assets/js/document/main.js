(function ($) {
	"use strict";

	    $(".mode").on("click", function () {
			$('.mode i').toggleClass("fa-moon-o").toggleClass("fa-lightbulb-o");
			$('body').toggleClass("dark-only");
		});

		// font size
		$(".decrease").on("click", function () {
			$('.content').addClass("font-decrease").removeClass("font-increase");
		});

		$(".increase").on("click", function () {
			$('.content').addClass("font-increase").removeClass("font-decrease");
		});

		$(".reset").on("click", function () {
			$('.content').removeClass("font-decrease").removeClass("font-increase");
		});

		$(".toggle-sidebar").on("click", function () {
			$('.left-sidebar').toggleClass("open");
		});
	
	// $(".nav-sidebar .nav-item").on("click", function () {				
	// 	// $('.nav-sidebar .nav-item').removeClass("active");		
	// 	$(this).toggleClass("active");				
	// 	});

	
    $('.title').removeClass('active');
    $('.title').on('click', function () {
	  $('.dropdown-nav').slideUp('normal');	
      if ($(this).next().is(':hidden') == true) {
        $(this).addClass('active');
        $(this).next().slideDown('normal');
		}
	});
    $('.dropdown-nav').hide();
  
	$(window).on('scroll', function () {
		if ($(this).scrollTop() > 600) {
			$('.tap-top').fadeIn();
		} else {
			$('.tap-top').fadeOut();
		}
	});
	$('.tap-top').click(function () {
		$("html, body").animate({
			scrollTop: 0
		}, 600);
		return false;
	});

})(jQuery);

// sidebar active
var current = window.location.pathname
$(".nav-sidebar >li .nav-link").filter(function() {

	var link = $(this).attr("href");
	// console.log("active page", $(this).attr("href"));
    if(link){
        if (current.indexOf(link) != -1) {
            $(this).parents().children('ul').css('display', 'block');
            $(this).parents().children('.title').addClass('active');
			$(this).addClass('active');
            return false;
        }
    }
});

$('.left-sidebar').animate({
	scrollTop: $('a.nav-link.active').offset().top - 200
}, 1000);