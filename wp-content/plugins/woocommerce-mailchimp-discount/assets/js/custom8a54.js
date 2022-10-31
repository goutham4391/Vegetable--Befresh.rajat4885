// Set Cookie
function wcmd_setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

// Get Cookie
function wcmd_getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function wcmd_isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function open_wcmd_modal() {
  if( wcmd.wcmd_home == 'yes' && wcmd.is_home != '1' ) return;
  if( jQuery('#wcmd_modal').length > 0 ){
  var overlayClick = wcmd.overlay_click == 'yes' ? true : false;
  jQuery.magnificPopup.open({
      items: {
          src: '#wcmd_modal' 
      },
      type: 'inline',
      removalDelay: 1000,
      closeOnBgClick: overlayClick,
      callbacks: {
        beforeOpen: function() {
           this.st.mainClass = wcmd.effect;
        },
        beforeClose: function() {
          if( wcmd.hinge == 'yes' )
            this.content.addClass('hinge');
          else
            jQuery('.mfp-wrap').css('background', 'transparent');
        },
        close: function() {
          if( wcmd.hinge == 'yes' )
            this.content.removeClass('hinge');
            wcmd_setCookie( 'wcmd', 'yes', wcmd.cookie_length );
        },
        open: function(){
            jQuery('.mfp-wrap').css('background', wcmd.overlayColor);
        }
    }
    });
  }
}

jQuery(document).ready(function($) {
  if( wcmd_getCookie('wcmd') != 'yes' && wcmd.wcmd_popup != 'yes' ) {
    if( wcmd.exit_intent == 'yes' ) 
      $(document).on( 'mouseleave', open_wcmd_modal );
    else if( wcmd.only_btn != 'yes' )
      setTimeout( open_wcmd_modal, wcmd.delay*1000 );
  }
  if( wcmd.btn_trigger == 'yes' ){
    $('body').on('click','.wcmd-trigger',function(e){
      e.preventDefault();
      open_wcmd_modal();
    });
  }

  function wcmd_close_popup(){
    $.magnificPopup.close();
  }
  $('.wcmd-form').submit(function() {
    msg = '';
    $form = $(this);
    $form.find('.wcmd-validation').removeClass('success').hide();
    if(wcmd_isEmail($form.find('.wcmd_email').val())) {
      $form.parents('.wcmd-form-wrapper,#wcmd_modal').find('.wcmd-loading ').show();
      $.post( 
        wcmd.ajax_url, 
        {email: $form.find('.wcmd_email').val(), fname: $form.find('.wcmd_fname').val(), lname: $form.find('.wcmd_lname').val(), action: 'wcmd_subscribe'}, 
        function(data) {
          var response = jQuery.parseJSON(data);
          $form.parents('.wcmd-form-wrapper,#wcmd_modal').find('.wcmd-loading ').hide();
          if( typeof response.status  !== "undefined" && response.status == 'error' )
            $form.find('.wcmd-validation').html(response.error).css('display','inline-block');
          else{
            if( wcmd.close_time > 0 && $('.mfp-ready').length > 0 )
              setTimeout( wcmd_close_popup, wcmd.close_time*1000 );
            $form.find('.wcmd-validation').html(wcmd.success).addClass('success').css('display','inline-block');
          }
      });
    }
    else
      $form.find('.wcmd-validation').html( wcmd.valid_email ).css('display','inline-block');
      
    return false;
  });

});	
