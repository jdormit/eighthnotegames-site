var express = require('express');
var router = express.Router();
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

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Eighth Note Games' });
});

/* GET twitter feed. */
router.get('/tweets/:username/:count', function (req, res, next) {
	var user = String(req.params.username);
	var tweet_count = parseInt(req.params.count);
	twitter.getUserTimeline({screen_name: user, count: tweet_count}, twitterError, function(tweets) {
		res.json(tweets);
	});
});

/* POST twitter follow request */
router.get('/twitter-follow/:username', function (req, res, next) {
	var user = String(req.params.username);
	twitter.postCreateFriendship({screen_name: user, follow: true}, twitterError, function(response) {
		res.send(response);
	});
});

module.exports = router;
