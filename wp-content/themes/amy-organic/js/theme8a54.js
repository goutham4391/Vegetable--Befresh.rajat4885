(function($, window, document) {
	'use strict';
	var ORGANIC;
	ORGANIC = window.ORGANIC || {};
	ORGANIC.pageLoad = function() {
		var $body;
		$body = $(document.body);
		$(window).on('beforeunload', function() {
			$body.addClass('amy-fade-out');
		});
	};
	ORGANIC.mainNavigation = function() {
		$('#amy-site-nav').superfish({
			delay: 200,
			animation: {
				opacity: 'show'
			},
			speed: 'fast',
			speedOut: 'fast',
			cssArrows: false
		});
	};
	ORGANIC.mobileNavigation = function() {
		var liParent;
		$('#amy-menu-toggle').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('amy-menu-toggle-open');
			$('#amy-navigation-mobile').slideToggle(500, 'easeInOutExpo');
		});
		liParent = '#amy-navigation-mobile li:has(ul)';
		$(liParent + ' > a').after('<div class="amy-dropdown-plus"><i class="fa fa-plus"></i></div>');
		$(liParent + ' > .amy-dropdown-plus').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('amy-dropdown-times');
			$(this).parent().find('> ul').slideToggle(500, 'easeInOutExpo');
		});
		$(liParent + ' > a').on('click', function(e) {
			var $parent;
			if ($(this).attr('href') === '#') {
				e.preventDefault();
				$parent = $(this).parent();
				$parent.find('> .amy-dropdown-plus').toggleClass('amy-dropdown-times');
				$parent.find('> ul').slideToggle(500, 'easeInOutExpo');
			}
		});
	};
	ORGANIC.topModal = function() {
		var reposition;
		reposition = function($el) {
			var $wrapper, pos, rel_pos, wrapper_pos;
			$el.show();
			$wrapper = $el.parents('.amy-inner');
			if ($wrapper.length) {
				wrapper_pos = $wrapper.offset();
				pos = $el.offset();
				rel_pos = $el.position();
				if (pos.left + $el.outerWidth() > wrapper_pos.left + $wrapper.outerWidth()) {
					if ($wrapper.outerWidth() - $el.outerWidth() < 0) {
						$el.css('left', wrapper_pos.left - pos.left + rel_pos.left);
					} else {
						$el.css('left', wrapper_pos.left + $wrapper.outerWidth() - (pos.left - rel_pos.left + $el.outerWidth()));
					}
				}
			}
			$el.hide();
		};
		$('.amy-top-modal').each(function() {
			var $content, $this, $trigger, trigger_event;
			$this = $(this);
			$trigger = $this.find('.amy-top-modal-trigger');
			trigger_event = $trigger.data('trigger-event');
			$content = $this.find('.amy-top-modal-content');
			reposition($content);
			if (trigger_event !== 'click') {
				$this.mouseover(function() {
					$('.amy-top-modal.amy-opened').not($this).removeClass('amy-opened').find('.amy-top-modal-content').fadeOut('fast');
					$content.stop().fadeIn('fast');
				}).mouseout(function() {
					$content.stop().fadeOut('fast');
				});
			} else {
				$trigger.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					if ($this.hasClass('amy-opened')) {
						$this.removeClass('amy-opened');
						$content.fadeOut('fast');
					} else {
						$this.trigger('amy-close-modals').addClass('amy-opened');
						$content.fadeIn('fast');
						$content.find('input').focus();
					}
				});
				$content.click(function(e) {
					if (e.stopPropagation) {
						e.stopPropagation();
					} else if (window.event) {
						window.event.cancelBubble = true;
					}
				});
			}
		});
		$(document.body).on('click amy-close-modals', function() {
			$('.amy-top-modal.amy-opened').removeClass('amy-opened').find('.amy-top-modal-content').fadeOut('fast');
		});
	};
	ORGANIC.isotopeInitialize = function() {
		$('.amy-isotope-container').each(function() {
			var $iso, $isoFilter, $isoItem, $isoLoader, $isoWrapper, $this;
			$this = $(this);
			$iso = $this.find('.amy-isotope-loop');
			$isoLoader = $this.find('.amy-isotope-loading');
			$isoWrapper = $this.find('.amy-isotope-wrapper');
			$isoFilter = $this.find('.amy-isotope-filter a');
			$isoItem = $this.find('.amy-isotope-item');
			$isoLoader.show();
			$iso.imagesLoaded(function() {
				setTimeout(function() {
					$isoLoader.hide();
					$isoWrapper.addClass('amy-isotope-loaded');
				}, 300);
				$iso.isotope({
					animationEngine: 'best-available',
					layoutMode: $iso.data('layout') || 'masonry'
				});
				$(window).on('debouncedresize', function() {
					setTimeout(function() {
						$iso.isotope('relayout');
						$(window).resize();
					}, 300);
				});
			});
		});
	};
	ORGANIC.productFilter = function() {
		$('.amy-product-filter ul li').each(function() {
			var $container, $ct, $data, $pt, $this, $window, checkWidth;
			$this = $(this);
			$data = $this.attr('data-filter');
			$pt = $this.parents('.amy-product-filter');
			$ct = $pt.siblings('.amy-product-content');
			if ($('.amy-product-filter').hasClass('no-carousel')) {
				$container = $('.amy-product-content');
				$window = $(window);
				checkWidth = function() {
					var windowsize;
					windowsize = $window.width();
					if (windowsize >= 1600) {
						$container.isotope({
							masonry: {
								columnWidth: 310,
								isFitWidth: true
							}
						});
					}
					if ((1400 < windowsize && windowsize < 1600)) {
						$container.isotope({
							masonry: {
								columnWidth: 250,
								isFitWidth: true
							}
						});
					}
					if (windowsize <= 1400) {
						return $container.isotope({
							masonry: {
								columnWidth: 220,
								isFitWidth: true
							}
						});
					}
				};
				checkWidth();
				$(window).resize(checkWidth);
				$this.click(function() {
					$pt.find('ul li').removeClass('active');
					$this.addClass('active');
					if ($data === 'all') {
						$('.amy-product-content').isotope({
							filter: '*'
						});
					} else {
						$('.amy-product-content').isotope({
							filter: '.' + $data
						});
					}
				});
			} else {
				$this.click(function() {
					$pt.find('ul li').removeClass('active');
					$this.addClass('active');
					if ($data === 'all') {
						$ct.slick('slickUnfilter').delay(500);
					} else {
						$ct.slick('slickUnfilter').delay(500);
						$ct.slick('slickFilter', '.' + $data);
					}
				});
			}
		});
	};
	ORGANIC.imageAtributes = function() {
		$('.amy-organic-attributes').each(function() {
			var $that, item;
			$that = $(this);
			item = $(this).find('.amy-organic-atribute-item');
			$(this).click(function() {
				item.removeClass('active');
				return item.find('em').addClass('bullets');
			});
			item.each(function() {
				var $this;
				$this = $(this);
				$this.click(function(el) {
					el.stopPropagation();
					$that.find('.amy-organic-atribute-item').removeClass('active');
					$that.find('.amy-organic-atribute-item em').addClass('bullets');
					$this.addClass('active');
					return $this.find('em').removeClass('bullets');
				});
			});
		});
	};
	ORGANIC.headernavbar = function() {
		return $('#amy-navbar-toggle').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('amy-navbar-open');
			$('.amy-navbar-content').toggleClass('open');
			e.stopPropagation();
		});
	};
	ORGANIC.parallaxScroll = function() {
		return $(window).scroll(function() {
			var scrolled;
			scrolled = $(window).scrollTop();
			$('#parallax-bg1').css('top', (0 - (scrolled * .5)) + 'px');
			$('#parallax-bg2').css('top', (0 - (scrolled * .5)) + 'px');
			$('#parallax-bg3').css('top', (0 - (scrolled * .78)) + 'px');
		});
	};
	$(document).ready(function() {
		$('select.amy-fancy-select').amyuiFancySelect();
		$('input.amy-number-input').amyuiNumberInput();
		$('.amy-slick').slick();
		$(document).on('click.bs.tab.data-api', '.bs-tab-nav a', function(e) {
			e.preventDefault();
			$(this).tab('show');
		});
		ORGANIC.pageLoad();
		ORGANIC.mainNavigation();
		ORGANIC.mobileNavigation();
		ORGANIC.topModal();
		ORGANIC.isotopeInitialize();
		ORGANIC.productFilter();
		ORGANIC.imageAtributes();
		ORGANIC.headernavbar();
		ORGANIC.parallaxScroll();
	});
})(jQuery, window, document);