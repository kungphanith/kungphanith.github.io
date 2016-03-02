(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

var options = [
  {selector: '#header-text', offset: 50, callback: 'Materialize.fadeInImage("#header-text")' },
  {selector: '#image-2', offset: 50, callback: 'Materialize.fadeInImage("#image-2")' },
  {selector: '#about-content', offset: 50, callback: 'Materialize.fadeInImage("#about-content")' },
  
  // {selector: '#staggered-test', offset: 205, callback: 'Materialize.toast("Please continue scrolling!", 1500 )' },
  // {selector: '#staggered-test', offset: 400, callback: 'Materialize.showStaggeredList("#staggered-test")' },
  // {selector: '#image-test', offset: 500, callback: 'Materialize.fadeInImage("#image-test")' }
];
Materialize.scrollFire(options);