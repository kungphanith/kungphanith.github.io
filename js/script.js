$(document).on('ready',function(){
  $('a[href^="#"]').click(function() {
    $('html,body').animate({ scrollTop: $(this.hash).offset().top}, 800);
    return false;
    e.preventDefault();
  });

  

});

$(window).bind('scroll', function () {
    if ($(window).scrollTop() > 50) {
        $('.lp-top-menu-conainer').addClass('fixed');
    } else {
        $('.lp-top-menu-conainer').removeClass('fixed');
    }
});

$('demo-video-box').click(function(){
    console.log('event handler');
});


$(document).ready(function(){

    

    if($(document).width() >= 1200 ){
        $('.loader').hide('fast');
        $('#page1').show('slow');
        $('#image1-clip-mask').fadeIn('slow');


        // shap1 animation
        $('#shap1').css('left', '50%');
        $('#shap1').animate({'left':'50px'}, 'slow');

        // shap2 animation
        $('#shap2').css('bottom', '50%');
        $('#shap2').animate({'bottom':'170px'}, 'slow');

        // profile-box animation
        $('#profile-box').css('opacity', '0');
        $('#profile-box').animate({'opacity':'1'}, 'slow');

        // Image1 Animation
        $('#image1-clip-mask').css('width', '0');
        $('#image1-clip-mask').animate({'width':'30%'}, 'fast');
    }
    else{
        $('.loader').hide('fast');
        $('#page1').show('slow');
        $('#image1-clip-mask').fadeIn('slow');


        // shap1 animation
        $('#shap1').css('left', '50%');
        $('#shap1').animate({'left':'10px'}, 'slow');

        // shap2 animation
        $('#shap2').css('bottom', '50%');
        $('#shap2').animate({'bottom':'100px'}, 'slow');

        // profile-box animation
        $('#profile-box').css('opacity', '0');
        $('#profile-box').animate({'opacity':'1'}, 'slow');

        // Image1 Animation
        $('#image1-clip-mask').css('width', '0');
        $('#image1-clip-mask').animate({'width':'100%'}, 'fast');
    }
    

    $('.link').click(function(){
        $('.page').fadeOut('slow');
        $('#'+ $(this).attr('linkTo')).fadeIn('slow');
    });

})