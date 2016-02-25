function load_page() {
	if (page == 'main') {
		load_main(function (result) {
			$('#main-content').empty();
			$('#main-content').html(result);
			$('.slider').slider({full_width: true});
			$('.tooltipped').tooltip({delay:50});
		});
	}
	else if (page == 'blog') {
		$('#main-content').empty();
		load_blog(function (blog_html) {
			$('#main-content').html(blog_html);
		});	
	}
	else if (page == 'projects') {
		$('#main-content').empty();
		load_projects(function (data){
			$('#main-content').html(data);
		});		
	}
	else if (page == 'about') {
		$('#main-content').empty();
		load_about(function(data) {
			$('#main-content').html(data);
		});		
	}
}

$(document).ready(function() {
	$(".button-collapse").sideNav();	
	load_page();
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
				var date = parse_blogger_date(this.published.$t);
				if (comments[post_id]) {
					comment_str = "<h4 class='flow-text'>Comments:</h4>";
					for (com in comments[post_id]) {
						var comment = comments[post_id][com];
						comment_str += "<div class='row'>" +
											"<div class='col s12'>" +
												"<div class='card grey lighten-1'>" +
													"<div class='card-content black-text'>" +
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
								"<div class='col s10 push-s1 flow-text'>" +
									"<h3>" + this.title.$t +"</h3>" +
									"<h4>" + date + "</h4>" +
									"<p>" + content + "</p>" +
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
			var date = parse_blogger_date(post.feed.entry[0].published.$t);
			var blog_str =  "<div class='card news-content'>" +
								"<div class='card-content'>" +
									"<span class='card-title'><b>" + title + "</b><span class='right'>" + date + "</span></span>" +
									"<p class='flow-text'>" + content + "</p>" +
								"</div>" +
								"<div class='card-action'>" +
									"<a href='#' class='to_blog valign-wrapper'><span class='flow-text'>Read More</span><i class='medium material-icons'>trending_flat</i></a>" +
								"</div>" +
							"</div>";
			$(home_html).find('#latest_blog').append(blog_str);
		});
		//get interesting stuff
		$.get('/html/interesting.html', function(data) {
			$(home_html).find('#interesting_stuff').append(data);	
		});
		//get tweets
		$.get('/tweets/eighthnotegames/4', function(tweet_results) {
			var tweets_obj = JSON.parse(tweet_results);
			for (tweet in tweets_obj) {
				var img_string = "";
				var tweet_url = "https://twitter.com/" + tweets_obj[tweet].user.id_str + "/status/" + tweets_obj[tweet].id_str;
				if (tweets_obj[tweet].entities.media) { //render any pics
					img_string= "<div class='card-image'>"+
									"<img src='" + tweets_obj[tweet].entities.media[0].media_url_https + "'>" +
								"</div>"
				}
				$(home_html).find('#tweets').append(
					"<a href='" + tweet_url + "' target='_blank'>" +
						"<div class='card hoverable tweets'>" +
							img_string +
							"<div class='card-content'>" +
								"<p>" + tweets_obj[tweet].text + "</p>" +
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

function twitterFollow(username) { //this is called by home.html
	$.get('./twitter-follow/' + username, function(response) {
		console.log(response);
	});
}