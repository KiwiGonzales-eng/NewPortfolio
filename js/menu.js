jQuery(document).ready(function($){
	var MQL = 1170;

	if($(window).width() > MQL) {
		var headerHeight = $('.box-header').height();
		$(window).on('scroll', { previousTop: 0 }, function () {
			var currentTop = $(window).scrollTop();
			if (currentTop < this.previousTop ) {
				if (currentTop > 0 && $('.box-header').hasClass('is-fixed')) $('.box-header').addClass('is-visible');
				else $('.box-header').removeClass('is-visible is-fixed');
			} else {
				$('.box-header').removeClass('is-visible');
				if(currentTop > headerHeight && !$('.box-header').hasClass('is-fixed')) $('.box-header').addClass('is-fixed');
			}
			this.previousTop = currentTop;
		});
	}

	function closePrimaryNav(){
		$('.box-menu-icon').removeClass('is-clicked');
		$('.box-header').removeClass('menu-is-open');
		$('.box-primary-nav').removeClass('is-visible');
		$('body').removeClass('overflow-hidden');
	}

	$('.box-primary-nav-trigger').on('click', function(e){
		e.preventDefault();
		var opening = !$('.box-primary-nav').hasClass('is-visible');
		if(opening){
			$('.box-menu-icon').addClass('is-clicked');
			$('.box-header').addClass('menu-is-open');
			$('.box-primary-nav').addClass('is-visible');
			$('body').addClass('overflow-hidden');
		}else{
			closePrimaryNav();
		}
	});

	// Close the black overlay before any menu destination is followed.
	$('.box-primary-nav a').on('click', function(){ closePrimaryNav(); });
	$(document).on('keyup', function(e){ if(e.key === 'Escape') closePrimaryNav(); });
});
