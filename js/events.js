$(document).on('click', '', function(e){

})

$(document).on('mouseover', '.card:not(.no_buy)', function(e){
	let where = e.currentTarget.id.split('-')[0];
	let id = Number(e.currentTarget.id.split('-')[1]);
	ui.hover(where, id);
});

$(document).on('mouseleave', '.card:not(.no_buy)', function(e){
	let where = e.currentTarget.id.split('-')[0];
	let id = Number(e.currentTarget.id.split('-')[1]);
	ui.leave(where, id);
});
$(document).on('click', '#hand_area .card', function(e){


	let id = Number(e.currentTarget.id.split('-')[1]);
	game.play(id);
	game.do_turn();
	ui.refresh();
})

$(document).on('click', '#market .card', function(e){
	let id = Number(e.currentTarget.id.split('-')[1]);
	game.buy(id);
	game.do_turn();
	ui.refresh();
})

$(document).on('click', 'button', function(e){
	ui.refresh()
})
