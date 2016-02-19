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