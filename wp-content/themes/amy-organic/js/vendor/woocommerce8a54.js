(function($, window, document) {
	'use strict';
	return $(document).ready(function() {
		$('.woocommerce-view-mode a').click(function(e) {
			var $this;
			e.stopPropagation();
			e.preventDefault();
			$this = $(this);
			$this.siblings('a').removeClass('active');
			$this.addClass('active');
			$('.product').animate({
				opacity: 0
			}, 500, function() {
				if ($this.hasClass('amy-list-view-button')) {
					$(this).addClass('list-view');
				} else {
					$(this).removeClass('list-view');
				}
				$(this).animate({
					opacity: 1
				}, 500);
			});
		});
		if ($('.price_slider_wrapper').length) {
			$('.price_slider_wrapper').each(function() {
				var $this;
				$this = $(this);
				$this.find('button').insertAfter($this.find('.price_label'));
			});
		}
		$('.quantity input[type="number"]').amyuiNumberInput();
		$('.woocommerce-ordering select.orderby').addClass('input-rounded').amyuiFancySelect();
		$(document.body).append('<div id="amy-wc-popup-message" style="display: none;"><div id="amy-wc-message"></div></div>').on('wc_fragments_refreshed', function() {
			$('.quantity input[type="number"]').not('.ni-initialized').amyuiNumberInput();
		}).on('adding_to_cart', function($button, data) {}).on('added_to_cart', function(fragments, cart_hash, $button) {
			var $wrapper;
			$('#amy-wc-message').html(window.amy_wc.product_added);
			$wrapper = $('#amy-wc-popup-message');
			$wrapper.css('margin-left', 0 - $wrapper.width() / 2);
			$wrapper.fadeIn();
			setTimeout(function() {
				return $wrapper.fadeOut();
			}, 2000);
		});
	});
})(jQuery, window, document);