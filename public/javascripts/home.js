$(document).ready(function() {
	$(".button-collapse").sideNav();
	
	$(".blog").click(function(event) {
		event.preventDefault();
		$('#main-content').empty();
		load_blog(function (blog_html) {
			$('#main-content').html(blog_html);
		});
	});
	
	$(".projects").click(function(event) {
		event.preventDefault();
		$('#main-content').empty();
		$('#main-content').html(load_projects());
	});
	
	$(".about").click(function(event) {
		event.preventDefault();
		$('#main-content').empty();
		$('#main-content').html(load_about());
	});	
});

function load_blog(callback) {
	var feed = 'http://eighthnotegames.blogspot.com/feeds/posts/default?alt=json&callback=?';
	var blog_html = "";
	$.getJSON(feed, function(json) {
		var entries = json.feed.entry;
		console.log(feed);
		$.each(entries, function () {
			var post = $(this);
			blog_html += "<div class='row blog'>" +
							"<div class='col s12'>" +
								"<div class='card green lighten-3'>" +
									"<div class='card-content'>" +
										"<span class='card-title'>" + this.title.$t + "</span>" +
										"<p>" + this.content.$t + "</p>" +
									"</div>" +
								"</div>" +
							"</div>" +
						"</div>";
			callback(blog_html);
		});
	});
}

function load_projects() {
	return "These are my projects!";
}

function load_about() {
	return "I am Eighth Note Games and I am amazing!";
}