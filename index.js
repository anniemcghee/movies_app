// ----- Needed to activate the dependency express -----
var express = require('express');

// ----- Needed to activate the dependency body parser
var bodyParser = require('body-parser');

// ----- This is required to connect our js page to our database/models. It will default to index.js ----
var db = require("./models/index.js");

// ----- Needed to use express within our app ----
var app = express();

// ----- This activates body parser - a tool that parses out JSON data ----
app.use(bodyParser.urlencoded())

// ----- This is required for express ----
app.set("view engine",'ejs');

// ----- This is needed to connect my public folder to the whole deal -----
app.use(express.static(__dirname + '/public'));

// ----- This is the home page that does nothing ----
app.get('/movies/home', function (req,res) {
	res.render('movies/home');
})

// ----- When watchlist loads, it loads everything from the database -----
app.get('/movies/watchlist', function( req, res) {
	db.watch.findAll().done(function(err, data2){
		res.render('movies/watchlist',{data2: data2});
	})
})

//----- Uses input on home.ejs to render results from the omdb API ----
app.get('/movies/search/', function (req, res) {
	var searchTerm = req.query.movies;
	var request = require('request');

	request("http://omdbapi.com/?s=" + searchTerm, function (error, response, body){
		if (!error && response.statusCode == 200) {
			var results = JSON.parse(body);
			res.render('movies/search', results)
		}
		else {
			res.render ('/movies/error')
		}
	})
})

// ---- Create comments page, Lists all comments for a specific film in watchlist ----
// ---- Has form to add comment - takes a URL parameter from watchlist item id ----
app.get('/movies/watchlist/:id/comments', function(req,res) {
	var commentId = req.params.id;
	db.final.findAll({where: {watchId:commentId}}).then(function(info){
		res.render('movies/comments', {commentId:commentId, info:info});
	})
})

// ---- Posts from the add comment button ------
app.post('/movies/watchlist/:id/comments', function (req,res){
	db.watch.find({where: {id: req.params.id}}).then(function(thisData){
		thisData.createFinal({content:req.body.content }).then(function(newData){
			res.redirect('comments');
		})
	})
})

// ----- Requests individual movies for id.ejs page and shows tomato/plot info -----
app.get('/movies/:imdb', function (req, res){
	var request = require('request');
	var id = req.params.imdb;

	request("http://omdbapi.com/?i=" + id +"&tomatoes=true&"+"&plot=full&", function (error, response, body){
		if (!error && response.statusCode == 200) {
			var results2 = JSON.parse(body);
			//this next piece of code relates to finding if the item already exists in the watchlist
			db.watch.count({where:{imdb_code:results2.imdbID}}).then(function(foundItemCount){
			//the variable converts it to a boolean for my ejs page
				var wasFound = foundItemCount > 0;
				res.render('movies/ids',{movieFound:wasFound,results2:results2});
			})
			//I need to pass in my variable to my results as a value of a key
			
		}
		else {
			res.render ('/movies/error');
		}
	})
})

// ----- Adds to the watchlist; connected to button on id.ejs & addItem in script.js  ------
app.post('/movies/watchlist', function (req, res) {
	db.watch.findOrCreate({ where: {imdb_code: req.body.imdb_code, title: req.body.title, year: req.body.year }}).spread(function(data,created){
		res.send({data:data,wasCreated:created});
	})
})


// ----- Deletes from the watchlist; connected to buttons on watchlist.ejs & deleteItem in script.js -----
app.delete('/movies/watchlist/:id', function(req,res){
	db.watch.destroy({where: {id:req.params.id}}).then(function(data){
		res.send({deleted:data});
	})
})

// ----- This is the about page that does nothing ----
app.get('/site/about', function (req, res) {
	res.render('site/about');
})

// ----- Needed to talk to the port - will update when deploying to Heroku -----
app.listen(3000);
