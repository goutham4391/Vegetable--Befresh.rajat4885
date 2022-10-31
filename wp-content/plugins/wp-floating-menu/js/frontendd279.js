(function ($) {
    $(function () {
     
     /** Trigger Menu stretch */
        if($(".wpfm-nav-strech-trigger")[0] && ($(".wpfm-nav-strech-trigger").attr('id') == 'right' 
        || $(".wpfm-nav-strech-trigger").attr('id') == 'left')){
         $( '.wpfm-nav-strech-trigger' ).click(function(e){
            e.preventDefault();
            $( '.wpfm-nav-strech-trigger' ).hide();
            $('ul.wpfm-nav-show-hide').slideToggle(400);            
         }); 
     } 
     
     /** Trigger Menu close */
        if($(".wpfm-nav-close-trigger")[0] && ($(".wpfm-nav-close-trigger").attr('id') == 'right' 
        || $(".wpfm-nav-close-trigger").attr('id') == 'left')){
         $( '.wpfm-nav-close-trigger' ).click(function(e){
            e.preventDefault();
            $( '.wpfm-nav-strech-trigger' ).show();
            $('ul.wpfm-nav-show-hide').slideUp(400);
         }); 
     }                                 
     
     /** On hover effect for template 7 */                              
     $(".wpfm-menu-name").hover(function () {
        $(this).find('.wpfm-tootltip-title').css('opacity','1');
     });  
       
     /** Initialize active class for on scroll event */
     if($('.wpfm-floating-wh-wrapper a[href^="#"]').length > 0){       
        $(document).on("scroll", onScroll);       
        }    
     
     /** Inline Navigation Js */
     $('.wpfm-floating-wh-wrapper a[href^="#"]').on('click',function (e){
       e.preventDefault();
       var target = $(this).attr('href');
       if($(target).length > 0){
       $('html, body').stop().animate({
            'scrollTop':  $(target).offset().top+1
        }, 900, 'swing', function () {            
           $(document).on("scroll", onScroll);
            });          
            }
        });
      
        /** Add Class on scroll */
        function onScroll(event){
        var scrollPos = $(document).scrollTop();
        $('.wpfm-menu-wrapper a[href^="#"]').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if(refElement != '#' && $(refElement).length > 0){
            if(refElement.position().top){
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos){
                $('.wpfm-menu-wrapper ul li a').removeClass("wpfm-active-nav");
                currLink.addClass("wpfm-active-nav");
            }
            else{
                currLink.removeClass("wpfm-active-nav");
                }
              } 
            }
        });
        }             
    }); /** Function ends */
}(jQuery));