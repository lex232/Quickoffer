(function ($) {
    "use strict";
    
    $(".light-layouts").on( "click", function() {
        localStorage.setItem("body-wrapper", "");
    });
    $(".box-layouts").on( "click", function() {
        localStorage.setItem("body-wrapper", "box-layout");
    });
    $(".dark-layouts").on( "click", function() {
        localStorage.setItem("body-wrapper", "dark-only");
    });


    $('.prooduct-details-box .close').on('click', function (e) {
        var order_details = $(this).closest('[class*=" col-"]').addClass('d-none');
    })
   })(jQuery);