(function($) {
	$.fn.amyuiNumberInput = function(options) {
		var c, settings;
		if (options == null) {
			options = {};
		}
		settings = $.extend({
			prefix: 'ni-'
		}, options);
		c = function(className) {
			return settings.prefix + className;
		};
		return this.each(function(e) {
			var $downBtn, $input, $upBtn, disabled, intervalDown, intervalUp, max, min, step, stepDown, stepUp, wrapper;
			$input = $(this);
			if ($input.hasClass(c('initialized')) || $input.prop('tagName').toLowerCase() !== 'input') {
				return;
			}
			$input.addClass(c('initialized'));
			$input.wrap('<div class="amyui-number-input">');
			wrapper = $input.parent();
			if ($input.data('class')) {
				wrapper.addClass($input.data('class'));
			}
			$downBtn = $('<span></span>').addClass(c('down'));
			$upBtn = $('<span></span>').addClass(c('up'));
			wrapper.prepend($downBtn);
			wrapper.append($upBtn);
			disabled = $input.prop('disabled');
			if (disabled) {
				wrapper.addClass(c('disabled'));
			}
			min = typeof $input.prop('min') !== 'undefined' ? parseInt($input.prop('min')) : false;
			max = typeof $input.prop('max') !== 'undefined' && (min === false || $input.prop('max') > min) ? parseInt($input.prop('max')) : false;
			step = typeof $input.prop('step') !== 'undefined' ? parseInt($input.prop('step')) : 1;
			intervalDown = null;
			intervalUp = null;
			stepUp = function() {
				var value;
				if ($input.prop('disabled')) {
					return;
				}
				value = parseInt($input.val());
				value += step;
				if (max !== false && value > max) {
					value = max;
				}
				$input.val(value).trigger('change');
			};
			stepDown = function() {
				var value;
				if ($input.prop('disabled')) {
					return;
				}
				value = parseInt($input.val());
				value -= step;
				if (min !== false && value < min) {
					value = min;
				}
				$input.val(value).trigger('change');
			};
			$downBtn.mousedown(function() {
				stepDown();
				intervalDown = setInterval(stepDown, 150);
			}).mouseup(function() {
				clearInterval(intervalDown);
			});
			$upBtn.mousedown(function() {
				stepUp();
				intervalUp = setInterval(stepUp, 150);
			}).mouseup(function() {
				clearInterval(intervalUp);
			});
			$input.on('keydown', function(e) {
				var w;
				w = e.which;
				if (w === 38) {
					e.preventDefault();
					stepUp();
				} else if (w === 40) {
					e.preventDefault();
					stepDown();
				}
			});
		});
	};
})(jQuery);