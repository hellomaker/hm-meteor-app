Template.home.onCreated( function() {
  Meteor.subscribe( 'workshops' );
});

Template.home.helpers({
  workshops: function(){
    return Workshops.find({}, {sort: {submitted: 1}});
  }
});

Template.home.rendered = function(){
/* Starting Animation on Load */
	$('<img/>').attr('src', 'triangles.svg').load(function(){
		//graphics appear
		$('#triangles').animate({
			'opacity': '1',
		}, 1000, function(){
			$('.hero-tagline h1').animate({
				//first line appear
				'padding-bottom': '.1em',
				'opacity': '1'
			}, 300, function (){
				//second line appear
				$('.hero-tagline h2').animate({
				'opacity': '1'
			}, 600, function (){
					$('.hero-tagline article').animate({
					'opacity': '1'
				}, 600, function (){
					//animation complete
					});
				});
			});
		});
	});

	//Changing placeholder attribute to a shorter one on mobile devices
	function hidePlaceholder(){
		if( screen.width < 400 ) {
			$('#sign-up-email').attr("placeholder", "your email");
		}
	}
	hidePlaceholder();

	//Community Endorsements
	$('.community-endorsement-list').children('li').first().children('.community-endorsement-item').addClass('is-active').next().addClass('is-open').show();
	$('.community-endorsement-item').on('click', function(){
	if (!$(this).hasClass('is-active')) {
		var communityEndorsementList = $('.community-endorsement-list');
		communityEndorsementList.find('.is-open').removeClass('is-open').hide();
		communityEndorsementList.find('.is-active').removeClass('is-active');
		$(this).next().toggleClass('is-open').fadeToggle();
		$(this).addClass('is-active');
	}
	});

	$('a[href*=#]:not([href=#])').smoothScroll({easing: 'swing', speed: 600});

	// Modal
	$(function() {
		$("#modal-1").on("change", function() {
		if ($(this).is(":checked")) {
			$("body").addClass("modal-open");
		} else {
			$("body").removeClass("modal-open");
		}
	});

	$(".modal-window").on("click", function() {
		$(".modal-state:checked").prop("checked", false).change();
	});

	$(".modal-inner").on("click", function(e) {
		e.stopPropagation();
	});
	});

};
