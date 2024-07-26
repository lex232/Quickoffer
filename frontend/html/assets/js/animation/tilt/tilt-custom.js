(function($) {
"use strict";
   var tilt_custom = {
      init: function() {
         const tilt = $('.js-tilt').tilt();
         $('.js-destroy').on('click', function () {
            const element = $(this).closest('.js-parent').find('.js-tilt');
            element.tilt.destroy.call(element);
         });
         $('.js-getvalue').on('click', function () {
            const element = $(this).closest('.js-parent').find('.js-tilt');
            const tilt_animation = element.tilt.getValues.call(element);
         });
         $('.js-reset').on('click', function () {
            const element = $(this).closest('.js-parent').find('.js-tilt');
            element.tilt.reset.call(element);
         });
      }
   };
    tilt_custom.init()
})(jQuery);