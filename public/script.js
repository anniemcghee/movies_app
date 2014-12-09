$(function(){
	
	deleteItem();
	addItem();

});

// var addSuccess = function(){
// 	var addButton =  $('#add');
// 	addButton.on('click', function(event){
// 		alert('Added!');
// 	})
// }

var deleteItem = function(){
	$('.delete-btn').on('click', function(event){
		event.preventDefault();
		var thisButton = $(this);

		$.ajax({
			url:'/movies/watchlist/'+thisButton.data('id'),
			type:'DELETE',
			success:function(result){
				thisButton.closest('tr').fadeOut('slow', function() {
					$(this).remove();
				});
			}
		});
	});
};

var addItem = function(){
	$('.add-btn').on('click', function (event){
		var addButton = $(this);
		$.post('watchlist',{
			title:addButton.data('title'),
			year:addButton.data('year'),
			imdb_code:addButton.data('imdb')
		}, function(data){

			alert('Added!')

			console.log(data)
		})
	})
}



//$.post( url [data])
//inspect element on button to try some things in console
//find route $.post('/favorites',{title:'fake movie',year:'222',imdb_code'4444'}
//,function(data){
// })
//in the button get the info from hidden fields - use data-id tag
//could do a query on the ejs page to check for findOrCreate and keep an attribute...
//send back a json object