var apiKey = 'E8JrpEgVCBglciJxgutsr6MQ51NGo5Vi';
var userID = 'RebeccaEileenAdams';

(function() {
	var behanceUserAPI = 'http://www.behance.net/v2/users/' + userID + '?callback=?&api_key=' + apiKey;

	function setUserTemplate() {
		var userData = JSON.parse(sessionStorage.getItem('behanceUser')),
			getTemplate = $('#profile-template').html(),
			template = Handlebars.compile(getTemplate),
			result = template(userData);
		$('#header').html(result);
	};

	if (sessionStorage.getItem('behanceUser')) {
		setUserTemplate();
	} else {
		$.getJSON(behanceUserAPI, function(user) {
			var data = JSON.stringify(user);
			sessionStorage.setItem('behanceUser', data);
			setUserTemplate();
		});
	};

})();

(function() {
	var perPage = 12;
	var behanceProjectAPI = 'http://www.behance.net/v2/users/' + userID + '/projects?callback=?&api_key=' + apiKey + '&per_page=' + perPage;

	function setPortfolioTemplate() {
		var projectData = JSON.parse(sessionStorage.getItem('behanceProject')),
			getTemplate = $('#portfolio-template').html(),
			template = Handlebars.compile(getTemplate),
			result = template(projectData);
		$('#portfolio').html(result);
	};

	if (sessionStorage.getItem('behanceProject')) {
		setPortfolioTemplate();
	} else {
		$.getJSON(behanceProjectAPI, function(project) {
			var data = JSON.stringify(project);
			sessionStorage.setItem('behanceProject', data);
			setPortfolioTemplate();
		});
	};
})();

var ready;

ready = function() {

	var apiKey = 'E8JrpEgVCBglciJxgutsr6MQ51NGo5Vi';
	var userID = 'RebeccaEileenAdams';

	$(window).on("scroll touchmove", function(e) {
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 160,
			header = $('.portfolio-header');
		if (distanceY > shrinkOn) {
			header.addClass('small');
		} else {
			if (header.hasClass('small')) {
				header.removeClass('small');
			}
		}
	});

	$('#portfolio').on('click', '.portfolio-title', function() {
		var $this = $(this),
			projectID = $this.data('project-id'),
			beProjectContentAPI = 'http://www.behance.net/v2/projects/' + projectID + '?callback=?&api_key=' + apiKey,
			keyName = 'behanceProjectImages-' + projectID;
		
		// console.log(beProjectContentAPI);

		function showGallery(dataSource) {
			// $this.magnificPopup({
			// 	items: dataSource,
			// 	gallery: {
			// 		enabled: true
			// 	},
			// 	type: 'image',
			// 	mainClass: 'animated',
			// 	removalDelay: 350
			// }).magnificPopup('open');

			var pswpElement = document.querySelectorAll('.pswp')[0];
			// var options = {
			//     index: 0 // start at first slide
			// };
			var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, dataSource, false);
			gallery.init();
		};

		if (localStorage.getItem(keyName)) {
			var srcItems = JSON.parse(localStorage.getItem(keyName));
			showGallery(srcItems);
		} else {
			$.getJSON(beProjectContentAPI, function(projectContent) {
				var src = [];
				$.each(projectContent.project.modules, function(index, mod) {
					if (mod.src != undefined && mod.width != undefined && mod.height != undefined) {
						if (mod.caption_plain != undefined) {
							src.push({
								src: mod.src,
								title: mod.caption_plain,
								w: mod.width,
								h: mod.height
							});
						} else {
							src.push({
								src: mod.src,
								w: mod.width,
								h: mod.height
							});
						}
					}
				});
				var data = JSON.stringify(src);
				localStorage.setItem(keyName, data);
				showGallery(src);
			});
		};
	});
}

$(document).ready(ready);

$(document).on('page:load', ready);