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
	
	$(document).on('click', '.to_blog', function (event) {
		event.preventDefault();
		$('#main-content').empty();
		load_blog(function (blog_html) {
			$('#main-content').html(blog_html);
		});
	});
});

function load_blog(callback) {
	var get_comments = function(comments_json) {
		var comments = {};
		for (entry in comments_json.feed.entry) {
			var com = comments_json.feed.entry[entry];
			var post_id = (com['thr$in-reply-to'].ref).split("post-")[1];
			if (!comments[post_id]) comments[post_id] = [];
			comments[post_id].push(com);
		}
		for (post in comments) comments[post].reverse();
		return comments;
	};
	var feed = 'http://eighthnotegames.blogspot.com/feeds/posts/default?alt=json&callback=?';
	var comments_feed = 'http://eighthnotegames.blogspot.com/feeds/comments/default?alt=json&callback=?';
	var blog_html = "";
	$.getJSON(feed, function(json) {
		var blog_id = (json.feed.id.$t).split("blog-")[1];
		$.getJSON(comments_feed, function(comments_json) {
			var comments = get_comments(comments_json); //this will parse the comments into an object that groups comments by post
			var entries = json.feed.entry;
			$.each(entries, function () {
				var comment_str = "";
				var post_id = (this.id.$t).split("post-")[1];
				if (comments[post_id]) {
					comment_str = "<h4 class='flow-text'>Comments:</h4>";
					for (com in comments[post_id]) {
						var comment = comments[post_id][com];
						comment_str += "<div class='row'>" +
											"<div class='col s12'>" +
												"<div class='card red darken-1'>" +
													"<div class='card-content white-text'>" +
														"<span class='card-title'>" + comment.author[0].name.$t + "</span>" +
														"<p>" + comment.content.$t + "</p>" +
													"</div>" +
												"</div>" +
											"</div>" +
										"</div>"
					}
				}
				content = this.content.$t;
				blog_html += "<div class='row blog section'>" +
								"<div class='col s10 push-s1'>" +
									"<h3>" + this.title.$t +"</h3>" +
									"<p class='flow-text'>" + content + "</p>" +
									"<a class='btn' href='" + this.link[4].href + "#comment-form'>Post a Comment</a>" +
									comment_str +
								"</div>" +
							"</div>" +
							"<div class='divider'></div>";
				callback(blog_html);
			});
		});
	});
}

function load_main(callback) {
	$.get('/html/home.html', function(home) {
		var home_html = $(home);
		//get news
		$.get('/html/news.html', function(news) {
			$(home_html).find('#news_div').append(news);
		});
		//get latest blog post
		var post_url = 'http://eighthnotegames.blogspot.com/feeds/posts/default?max-results=1&alt=json&callback=?';
		$.getJSON(post_url, function(post) {
			var title = post.feed.entry[0].title.$t;
			var content = (post.feed.entry[0].content.$t).split("<a name='more'></a>")[0];
			var blog_str =  "<div class='card green darken-1'>" +
								"<div class='card-content'>" +
									"<span class='card-title'><b>" + title + "</b>	</span>" +
									"<p class='flow-text'>" + content + "</p>" +
								"</div>" +
								"<div class='card-action'>" +
									"<a href='#' class='to_blog valign-wrapper'><span>Read More</span><i class='medium material-icons'>trending_flat</i></a>" +
								"</div>" +
							"</div>";
			$(home_html).find('#news_div').append(blog_str);
		});
		//get tweets
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