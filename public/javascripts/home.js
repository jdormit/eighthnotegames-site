$(document).ready(function() {
	$(".button-collapse").sideNav();
	
	load_main(function (result) {
		$('#main-content').empty();
		$('#main-content').html(result);
	});
	
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
		load_projects(function (data){
			$('#main-content').html(data);
		});
	});
	
	$(".about").click(function(event) {
		event.preventDefault();
		$('#main-content').empty();
		load_about(function(data) {
			$('#main-content').html(data);
		});
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
			blog_html += "<div class='row blog section'>" +
							"<div class='col s10 push-s1'>" +
							//	"<div class='card green lighten-3'>" +
							//		"<div>" +
								"<h3>" + this.title.$t +"</h3>" +
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

function load_main(callback) {
	$.get('/html/home.html', function(home) {
		var home_html = $(home);
		$.get('/tweets', function(tweet_results) {
			var tweets_obj = JSON.parse(tweet_results);
			for (tweet in tweets_obj) {
				var img_string = "";
				var tweet_url = "https://twitter.com/statuses/" + tweets_obj[tweet].id_str;
				if (tweets_obj[tweet].entities.media) { //render any pics
					img_string= "<div class='card-image'>"+
									"<img src='" + tweets_obj[tweet].entities.media[0].media_url_https + "'>" +
								"</div>"
				}
				$(home_html).find('#tweets').append(
					"<a href='" + tweet_url + "' target='_blank'>" +
						"<div class='card hoverable red darken-1'>" +
							img_string +
							"<div class='card-content'>" +
								"<p class='white-text'>" + tweets_obj[tweet].text + "</p>" +
							"</div>" +
						"</div>" +
					"</a>"
				);
			}
			callback(home_html);
		});
	});
}

function load_projects(callback) {
	$.get('/html/projects.html', function (data) {
		callback(data);
	});
}

function load_about(callback) {
	$.get('/html/about.html', function(data) {
		callback(data);
	});
}