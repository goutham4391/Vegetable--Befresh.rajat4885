
;(function ($, window, document, undefined) {
	'use strict';

	//General
	function amyGeneral() {
		$('<div/>', {
			id: 'amy-loading'
		}).appendTo('#main');

		$('#amy-loading').append('<span></span>');

		//$('.amy-slick').slick();

		$('.amy-testimonial-fancybox').fancybox({
			maxWidth: 800
		});
	}

	function amyTestimonialSubmitForm() {
		var $loading 	= $('#amy-loading'),
			$form		= $('.amy-testimonial-form'),
			$rateclass	= $('.star-cb-group');

		$rateclass.find('input[type="radio"]').each(function() {
			$(this).change(function() {
				$rateclass.find('.amy-rate').val($(this).attr('value'));
			});
		});

		$form.each(function() {
			var $this 		= $(this),
				formData	= new FormData($this[0]),
				redirecturl	= $this.find('.url_redirect').val();

			$this.validate({
				submitHandler: function() {
					$.ajax({
						method: 'POST',
						url: amy_testimonial_script.ajax_url + '?action=amy_testimonial_submit_form&' + $form.serialize(),
						data: formData,
						processData: false,
						contentType: false,
						beforeSend: function() {
							$loading.addClass('open');
						},
						success: function(response) {
							alert(response);

							if (redirecturl !== '') {
								window.location.href = redirecturl;
							} else {
								window.location.reload();
							}
						}
					});
				}
			});
		});
	}

	$(document).ready(function() {
		amyGeneral();
		amyTestimonialSubmitForm();
	});

})(jQuery, window, document);