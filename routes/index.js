var http = require('http');
var express = require('express');
var router = express.Router();
var blog = require('../models/blog');
var Twitter = require('twitter-node-client').Twitter;
var twitter_config = {
	'consumerKey':'Csmm5LvpLvaPnijd72U2zdzqL',
	'consumerSecret': 'CHnAdOmhgznQsKm10qmTmuiUt73HpdvXX20cXfc9enEJa1Nt3s',
	'accessToken': '3278670055-4MGnujxpOAX0w9HtUVaml7anQ3m1t3gPFQvuq2L',
	'accessTokenSecret': 'gdlpDY2khfMqtGjvKNwyT7MiTtGMTiKpzJiCVC73v1lIn'
};

var twitter = new Twitter(twitter_config);
var twitterError = function(err, response, body) {
	console.log('Twitter Error: ' + JSON.stringify(err));
};

var apiKey = 'AIzaSyBkDcdPSiDFBoZrGCrQvIWUrO3AAkiz55g';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Eighth Note Games', page: '"main"'});
});

router.get('/blog/:post_id', function(req, res, next) {
	var post_id = String(req.params.post_id);
	res.render('index', {title: 'Eighth Note Games', page: '"blog"', post_id: post_id});
});

router.post('/get_post', function(req, res, next) {
	http.get('https://www.googleapis.com/blogger/v2/blogs/3197908088530535834/posts/8435695384925321771/&key=' + apiKey, function(response) {
		console.log('response: ' + response);
		res.send(response);
	});
});

router.get('/blog', function(req, res, next) {
	blog.getAll();
	res.render('index', { title: 'Eighth Note Games', page: '"blog"'});
});

router.get('/projects', function(req, res, next) {
	res.render('index', { title: 'Eighth Note Games', page: '"projects"'});
});

router.get('/about', function(req, res, next) {
	res.render('index', { title: 'Eighth Note Games', page: '"about"'});
});

/* GET twitter feed. */
router.get('/tweets/:username/:count', function (req, res, next) {
	var user = String(req.params.username);
	var tweet_count = parseInt(req.params.count);
	twitter.getUserTimeline({screen_name: user, count: tweet_count, exclude_replies: true}, twitterError, function(tweets) {
		res.json(tweets);
	});
});

module.exports = router;
