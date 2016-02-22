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
		$.each(entries, function () {
			var post = $(this);
			console.log(post);
			content = this.content.$t;
			blog_html += "<div class='row blog'>" +
							"<div class='col s10 push-s1'>" +
							//	"<div class='card green lighten-3'>" +
							//		"<div>" +
								"<h1>" + this.title.$t +"</h1>" +
								"<p class='flow-text'>" + content + "</p>" +
								"<div class='divider'></div>" +
							//		"</div>" +
							//	"</div>" +
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
	$.get('/html/about.html', function(data) {
		return data;
	});
}