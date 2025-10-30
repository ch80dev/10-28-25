class UI{
	constructor(){

	}

	get_card(id, card, for_market){
		//console.log(id, card, for_market);
		let buyable_class = "";
		if (for_market && game.player.money < card.cost + Number(id)){
			buyable_class = ' no_buy '
		}
		let market_label = "";
		if (for_market){			
			market_label = `<div class='market_expires market_expires-${card.market_expires}'>[ ${card.market_expires} ]</div>
			<div class='card_cost'> -$${card.cost + Number(id)}</div>`
		}
		let uses = card.uses;
		if (uses == null){
			uses = '&infin;';
		}
		return `<div id='hand-${id}' class='card ${buyable_class} '>
			<div class='card_header'>${uses}</div>
			<div class='card_description'>${Config.card_descriptions[card.effect_type](card.effect_params, game.player.money)}</div>
			${market_label}
		</div>`
	}

	refresh(){
		$("#money").html(game.player.money.toLocaleString());
		let txt = "";
		for (let id in game.hand){
			let card = game.hand[id];
			txt += this.get_card(id, card, false);
		}
		$("#hand_area").html(txt);
		txt = "";
		for (let id in game.market){
			let card = game.market[id];
			txt += this.get_card(id, card, true);
		}
		$("#market").html(txt);
		txt = "";
		for (let effect of game.player.effects){
			
			
			txt += `<div class='effect'>${Config.effect_descriptions[effect.name](effect.params)}</div>`
		}
		$("#effects").html(txt);
		$("#turn_section").html(game.turns);
		$("#total_earnings_section").html("$" + game.player.total_earned.toLocaleString() + " [" + game.card_class + "]");
	}
}
