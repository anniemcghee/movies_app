var express = require('express');
var bodyParser = require('body-parser');
var db = require("./models/index.js");

var app = express();

app.use(bodyParser.urlencoded())

app.set("view engine",'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/movies/home', function (req,res) {
	res.render('movies/home');
})


app.get('/movies/watchlist', function( req, res) {
	db.Watch.findAll().done(function(err, data2){
		res.render('movies/watchlist',{data2: data2});
	})
})

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


app.get('/movies/:imdb', function (req, res){
	var request = require('request');
	var id = req.params.imdb;

	request("http://omdbapi.com/?i=" + id +"&tomatoes=true&"+"&plot=full&", function (error, response, body){
		if (!error && response.statusCode == 200) {
			var results2 = JSON.parse(body);
			res.render('movies/id', results2);
		}
		else {
			res.render ('/movies/error');
		}
	})
})

app.post('/movies/watchlist', function (req,res) {
	db.Watch.findOrCreate({ where: {imdb_code: req.body.imdb_code, title: req.body.title, year: req.body.year }}).done(function(err,data,notCreated){
			db.Watch.findAll().done(function(err, data2){
				res.render('movies/watchlist',{data2: data2});
		})
	})
})

app.post('/movies/watchlist', function ( req,res ){
	db.Watch.find({ where: { imdb_code: req.body.imdb_code  } }).then(function(row){
  		row.destroy().success(function() {
		res.redirect('movies/watchlist');
  		})
	})
})

app.get('/site/about', function (req, res) {
	res.render('site/about');
})


app.listen(3000);



// app.post('/movies/watchlist', function (req,res) {
// 	db.Watch.findOrCreate({ where: {imdb_code: req.body.imdb_code, title: req.body.title, year: req.body.year }}).done(function(err,data,notCreated){
// 		if(notCreated) {
// 			db.Watch.findAll().done(function(err, data2){
// 				res.render('movies/watchlist',{data2: data2});
// 		})
// 		}
// 		else {
// 			db.Watch.findAll().done(function(err, data2){
// 				res.render('movies/watchlist',{data2: data2});
// 			})
// 		}
// 	})
// })

// app.post('/movies/watchlist', function (req,res) {
// 	db.Watch.create({ imdb_code: req.body.imdb_code, title: req.body.title, year: req.body.year }).done(function(err,data){
// 		db.Watch.findAll().done(function(err, data2){
// 			res.render('movies/watchlist',{data2: data2});
// 		})
// 	})
// })
