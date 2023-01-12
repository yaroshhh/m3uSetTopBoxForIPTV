(function ($) {
	"use strict";

		$('ul.navbar-nav li a').on('click', function() {
			$('ul.navbar-nav li').removeClass('active');
			$(this).parents('li').addClass('active');
		});
		
})(jQuery);