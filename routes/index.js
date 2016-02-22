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
	console.log('Twitter Error: ' + err);
};

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Eighth Note Games' });
});

/* GET twitter feed. */
router.get('/tweets', function (req, res, next) {
	console.log('getting tweets');
	twitter.getUserTimeline({screen_name: 'eighthnotegames', count: '10'}, twitterError, function(tweets) {
		res.json(tweets);
	});
});

module.exports = router;
