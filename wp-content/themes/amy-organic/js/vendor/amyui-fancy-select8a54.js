(function($) {
	$.fn.amyuiFancySelect = function(opts) {
		var isiOS, settings;
		if (opts == null) {
			opts = {};
		}
		settings = $.extend({
			forceiOS: false,
			includeBlank: false,
			optionTemplate: function(optionEl) {
				return optionEl.text();
			},
			optgroupTemplate: function(optgroupEl) {
				return optgroupEl.attr('label');
			},
			triggerTemplate: function(optionEl) {
				return optionEl.text();
			}
		}, opts);
		isiOS = !!navigator.userAgent.match(/iP(hone|od|ad)/i);
		return this.each(function() {
			var copyOptionsToList, disabled, nextElement, options, prevElement, sel, selClass, trigger, updateTriggerText, wrapper;
			sel = $(this);
			if (sel.hasClass('amyui-fancified') || sel.prop('tagName').toLowerCase() !== 'select') {
				return;
			}
			selClass = sel.attr('class');
			sel.addClass('amyui-fancified');
			sel.css({
				width: 1,
				height: 1,
				display: 'block',
				position: 'absolute',
				top: 0,
				left: 0,
				padding: 0,
				margin: 0,
				opacity: 0
			});
			sel.wrap('<div class="amyui-fancy-select">');
			wrapper = sel.parent();
			if (sel.data('class')) {
				wrapper.addClass(sel.data('class'));
			}
			wrapper.append($('<div class="fs-trigger">').addClass(selClass));
			if (!(isiOS && !settings.forceiOS)) {
				wrapper.append('<ul class="fs-options">');
			}
			trigger = wrapper.find('.fs-trigger');
			options = wrapper.find('.fs-options');
			disabled = sel.prop('disabled');
			if (disabled) {
				wrapper.addClass('fs-disabled');
			}
			updateTriggerText = function() {
				var triggerHtml;
				triggerHtml = settings.triggerTemplate(sel.find(':selected'));
				return trigger.html(triggerHtml);
			};
			nextElement = function(el, $els) {
				var index;
				index = $els.index(el);
				if (index === $els.length - 1) {
					index = -1;
				}
				return $($els.get(index + 1));
			};
			prevElement = function(el, $els) {
				var index;
				index = $els.index(el);
				if (index === 0) {
					index = $els.length;
				}
				return $($els.get(index - 1));
			};
			sel.on('blur.fs', function() {
				if (trigger.hasClass('fs-open')) {
					setTimeout(function() {
						return trigger.trigger('close.fs');
					}, 120);
				}
			});
			trigger.on('close.fs', function() {
				trigger.removeClass('fs-open');
				options.removeClass('fs-open');
			});
			trigger.on('click.fs', function() {
				var offParent, parent;
				if (!disabled) {
					trigger.toggleClass('fs-open');
					if (trigger.hasClass('fs-open')) {
						options.find('li.fs-selected').addClass('fs-hover');
					}
					if (isiOS && !settings.forceiOS) {
						if (trigger.hasClass('fs-open')) {
							sel.focus();
						}
					} else {
						if (trigger.hasClass('fs-open')) {
							parent = trigger.parent();
							offParent = parent.offsetParent();
							if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
								options.addClass('fs-overflowing');
							} else {
								options.removeClass('fs-overflowing');
							}
						}
						options.toggleClass('fs-open');
						if (!isiOS) {
							sel.focus();
						}
					}
				}
			});
			sel.on('enable', function() {
				sel.prop('disabled', false);
				wrapper.removeClass('fs-disabled');
				disabled = false;
				copyOptionsToList();
			});
			sel.on('disable', function() {
				sel.prop('disabled', true);
				wrapper.addClass('fs-disabled');
				disabled = true;
			});
			sel.on('change.fs', function(e) {
				if (e.originalEvent && e.originalEvent.isTrusted) {
					e.stopPropagation();
				} else {
					updateTriggerText();
				}
			});
			sel.on('update.fs', function() {
				wrapper.find('.fs-options').empty();
				copyOptionsToList();
			});
			sel.on('keydown', function(e) {
				var hovered, newHovered, w;
				w = e.which;
				hovered = options.find('.fs-hover');
				hovered.removeClass('fs-hover');
				if (!options.hasClass('fs-open')) {
					if (w === 13 || w === 32 || w === 38 || w === 40) {
						e.preventDefault();
						trigger.trigger('click.fs');
					}
				} else {
					if (w === 38) {
						e.preventDefault();
						if (hovered.length) {
							prevElement(hovered, options.find('li.fs-option')).addClass('fs-hover');
						} else {
							options.find('li.fs-option').last().addClass('fs-hover');
						}
					} else if (w === 40) {
						e.preventDefault();
						if (hovered.length) {
							nextElement(hovered, options.find('li.fs-option')).addClass('fs-hover');
						} else {
							options.find('li.fs-option').first().addClass('fs-hover');
						}
					} else if (w === 27) {
						e.preventDefault();
						trigger.trigger('click.fs');
					} else if (w === 13 || w === 32) {
						e.preventDefault();
						hovered.trigger('mousedown.fs');
					} else if (w === 9) {
						if (trigger.hasClass('fs-open')) {
							trigger.trigger('close.fs');
						}
					}
					newHovered = options.find('.fs-hover');
					if (newHovered.lenth) {
						options.scrollTop(0);
						options.scrollTop(newHovered.position().top - 12);
					}
				}
			});
			options.on('mousedown.fs', 'li.fs-option', function(e) {
				var clicked;
				clicked = $(this);
				options.find('.fs-selected').removeClass('fs-selected');
				clicked.addClass('fs-selected');
				trigger.addClass('fs-selected');
				sel.val(clicked.data('raw-value')).trigger('change').trigger('change.fs').trigger('blur.fs').trigger('focus.fs');
				setTimeout(function() {
					return sel.focus();
				}, 5);
			});
			options.on('mousedown.fs', 'li.fs-optgroup > span', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			options.on('mouseenter.fs', 'li.fs-option', function() {
				var hovered, nowHovered;
				nowHovered = $(this);
				hovered = options.find('.fs-hover');
				hovered.removeClass('fs-hover');
				nowHovered.addClass('fs-hover');
			});
			options.on('mouseleave.fs', 'li.fs-option', function() {
				options.find('.fs-hover').removeClass('fs-hover');
			});
			copyOptionsToList = function() {
				var generateChildren, selOpts;
				updateTriggerText();
				if (isiOS && !settings.forceiOS) {
					return;
				}
				selOpts = sel.find('option');
				generateChildren = function(el, $options) {
					el.children().each(function(i, child) {
						var $child, $li, $optGroups, optHtml;
						$child = $(child);
						if ($child.prop('tagName').toLowerCase() === 'optgroup') {
							optHtml = settings.optgroupTemplate($child);
							$optGroups = $('<ul class="fs-optgroup"></ul>');
							$li = $("<li class=\"fs-optgroup\"><span>" + optHtml + "</span></li>");
							$li.append($optGroups);
							$options.append($li);
							generateChildren($child, $optGroups);
						} else if ($child.prop('tagName').toLowerCase() === 'option') {
							optHtml = settings.optionTemplate($child);
							if ($child.prop('selected')) {
								$options.append("<li data-raw-value=\"" + ($child.val()) + "\" class=\"fs-option fs-selected\">" + optHtml + "</li>");
							} else {
								$options.append("<li data-raw-value=\"" + ($child.val()) + "\" class=\"fs-option\">" + optHtml + "</li>");
							}
						}
					});
				};
				generateChildren(sel, options);
			};
			copyOptionsToList();
		});
	};
})(jQuery);