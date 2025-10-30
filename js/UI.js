class UI{
	constructor(){

	}

	get_card(id, card, for_market){
		//console.log(id, card, for_market);
		let buyable_class = "";
		let card_txt = "<div class='card_container'>";
		if (for_market && game.player.money < card.cost + Number(id)){
			buyable_class = ' no_buy '
		}
		let market_expires = '';
		let market_header = "";
		let market_footer = '';
		if (for_market){		
			market_expires = ` market_expires-${card.market_expires} `
			market_header = `<div class='market_expires'>
							${card.market_expires} </div>`
			market_footer = `<div class='card_cost'> -$${card.cost.toLocaleString()}</div>`
		}
		let uses = card.uses;
		if (uses == null){
			uses = '&infin;';
		}
		card_txt += market_header;
		card_txt += 	
			`<div id='hand-${id}' class='card ${buyable_class} ${market_expires} '>
				<div class='card_header'>
					<span class='card_uses'>${uses}</span>							
				</div>
				<div class='card_description'>
					${Config.card_descriptions[card.effect_type](card.effect_params, game.player.money)}
				</div><div class='card_footer'>
					<span class='card_class'>[ ${card.class} ]</span>
				</div>
			</div>`
		card_txt += market_footer;
		card_txt += "</div>";
		return card_txt;
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
		$("#total_earnings_section").html("$" + game.player.total_earned.toLocaleString() );
		$("#card_class").html(" [" + game.card_class.toLocaleString() + "]");
	}
}
