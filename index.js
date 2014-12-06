var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded())

app.set("view engine",'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/movies/home', function (req,res) {
	res.render('movies/home');
})



app.get('/movies/search/', function (req, res) {
	var searchTerm = req.query.movies;
	var request = require('request');

	request("http://omdbapi.com/?s=" + searchTerm, function (error, response, body){
		if (!error && response.statusCode == 200) {
		var results = JSON.parse(body);
		console.log(results);
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
		res.render('movies/id', results2)
		}
		else {
		res.render ('/movies/error')
		}
	})
})
 //to star a movie as a favorite, it has to be in the :id page as a submit button and render to 
 //a link in the header - favorites. 
 //when you click, imdb code, title, year saves to database and your get a post alert
 //HIDDEN FORM FIELD IN YOUR EJS PAGE WITH EJS TAGS- change type to hidden and hdden form fields populated with info when you click 
 //watch list button. You can pass data to your post route through this hidden form
 //every starred movie gets passed to the favorite database and added to watch link
 //Also add list of movies into divs like Adrienne's and Claire's
 //Clean up backgrounds to be more dynamic
 //


app.get('/site/about', function (req, res) {
	res.render('site/about');
})

app.get('/site/contact', function (req, res) {
	res.render('site/contact');
})

app.listen(3000);