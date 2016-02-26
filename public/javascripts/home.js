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
			var margin_left = '47px';
			if ($(window).width() < 992)	margin_left = '2%';
			$('#timeline-button').css({
				position: 'absolute',
				"margin-top": '25px',
				"margin-left": margin_left,
				"top": "auto"
			});
			$('.button-collapse').sideNav({
				menuWidth: 400,
				closeOnClick: true
			});
			if (window.matchMedia("(min-width: 400px)").matches)
				$('.tooltipped').tooltip({delay: 50});
			var dropdown_pos = $('#timeline-button').offset().top;
			$(window).scroll(function() {
				var margin_left = '47px';
				if ($(window).width() < 992) {
					margin_left = '2%';
				}
				var current_scroll = $(window).scrollTop();
				if (current_scroll >= dropdown_pos) {
					$('#timeline-button').css({
						position: 'fixed',
						top: '7px',
					});
				}
				else {
					$('#timeline-button').css({
						position: 'absolute',
						"margin-top": '25px',
						"margin-left": margin_left,
						"top": "auto"
					});
				}
			});
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
	$(".button-collapse").sideNav({
		menuWidth: 400,
		closeOnClick: true
	});	
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
	var timeline_date = {};
	$.get('/html/blog.html', function(blog) {
		var blog_page = $(blog);
		$.getJSON(feed, function(json) {
			var blog_id = (json.feed.id.$t).split("blog-")[1];
			$.getJSON(comments_feed, function(comments_json) {
				var comments = get_comments(comments_json); //this will parse the comments into an object that groups comments by post
				var entries = json.feed.entry;
				$.each(entries, function () {
					var comment_str = "";
					var post_id = (this.id.$t).split("post-")[1];
					var date = parse_blogger_date(this.published.$t);
					if (timeline_date[date.date.year]) {
						if (timeline_date[date.date.year][date.date.month]) {
						timeline_date[date.date.year][date.date.month].push({title: this.title.$t, day: date.date.day});
						}
						else {
							timeline_date[date.date.year][date.date.month] = [];
							timeline_date[date.date.year][date.date.month].push({title: this.title.$t, day: date.date.day});
							if (!timeline_date[date.date.year].months_order) {
								timeline_date[date.date.year].months_order = [];
							}
							timeline_date[date.date.year].months_order.push(date.date.month);
						}
					} else {
						timeline_date[date.date.year] = {};
						timeline_date[date.date.year][date.date.month] = [];
						timeline_date[date.date.year][date.date.month].push({title: this.title.$t, day: date.date.day});
						if (!timeline_date.years_order) {
							timeline_date.years_order = [];
						}
						timeline_date.years_order.push(date.date.year);
						if (!timeline_date[date.date.year].months_order) {
								timeline_date[date.date.year].months_order = [];
							}
							timeline_date[date.date.year].months_order.push(date.date.month);
					}
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
					blog_html += "<a name='" + parse_title_as_anchor(this.title.$t) + "'><div class='row section'></a>" +
									"<div class='col s10 push-s1 flow-text'>" +
										"<h3>" + this.title.$t +"</h3>" +
										"<h4>" + date.date_str + "</h4>" +
										"<p>" + content + "</p>" +
										"<a class='btn' href='" + this.link[4].href + "#comment-form'>Post a Comment</a>" +
										comment_str +
									"</div>" +
								"</div>" +
								"<div class='divider'></div>";
				});
				$(blog_page).find('#posts').append(blog_html);
				
				//construct timeline
				timeline_date.years_order.sort(function(a,b){return b - a}); //sort years array
				console.log(timeline_date);
				var timeline_html = "<ul class='side-nav' id='timeline-dropdown'>";
				for (year in timeline_date.years_order) {
					var ordered_year = timeline_date.years_order[year];
					timeline_date[ordered_year].months_order.sort(function(a,b){return b - a});
					for (month in timeline_date[ordered_year].months_order) {
						var ordered_month = timeline_date[ordered_year].months_order[month];
						for (post in timeline_date[ordered_year][ordered_month]) {
							timeline_html += "<li><a href='#" + parse_title_as_anchor(timeline_date[ordered_year][ordered_month][post].title) + "'><span class='truncate'>" + months[ordered_month] + 
							" " + timeline_date[ordered_year][ordered_month][post].day + ", " + ordered_year + ": " + timeline_date[ordered_year][ordered_month][post].title + 
							"</span></a></li>"
						}
						timeline_html += "<li class='divider'></li>";
					}
				}
				timeline_html += '</ul>';
				$("<div class='left' id='sidebar'></div>").insertBefore($('.container'));
				$('#sidebar').append($("<a class='button-collapse btn-floating btn-large tooltipped' " +
				"id='timeline-button' href='#' data-position='right' date-delay='50' data-tooltip='Blog Archive' data-activates='timeline-dropdown'>" +
										"<i class='material-icons left'>list</i></a>"));
				$('#sidebar').append(timeline_html);
				callback(blog_page);
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