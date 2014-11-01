/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


// To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.my_custom_behavior = {
    attach: function(context, settings) {
	
	var current_role = '';

	$(".node-audio-story").hover(function() {
	    if($(this).hasClass("contributor")==true) {
		$(this).removeClass("contributor");
		current_role = 'contributor';
	    };
	    $(this).css("background-color","#3B4E54");
	    $(this).find(".play_button").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/play_circle.png') center center no-repeat");
	    $(this).find(".play_button").css("background-color","rgba(28,45,49,0.5)");
	}, function() {
//		$(this).css("background-color","#A6A8AB");
	    $(this).addClass(current_role);
	    $(this).find(".play_button").css("background-color", "transparent");
	    $(this).find(".play_button").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/phone_circle.png') center center no-repeat");
	});

    }
};


})(jQuery, Drupal, this, this.document);
