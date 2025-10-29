class UI{
	constructor(){

	}

	get_card(id, card, for_market){
		//console.log(id, card, for_market);
		let buyable_class = "";
		//console.log(card.cost + id);
		if (for_market && game.player.money < card.cost + Number(id)){
			buyable_class = ' no_buy '
		}
		let market_label = "";
		if (for_market){
			
			market_label = `<div class='market_expires'>[ ${card.market_expires} ]</div>
			<div class='card_cost'>Cost: $${card.cost + Number(id)} (+${id})</div>`
		}
		return `<div id='hand-${id}' class='card ${buyable_class} ${card.category}'>
			<div class='card_header'>${card.uses}</div>
			<div class='card_description'>${Config.card_descriptions[card.effect_type](card.effect_params)}</div>
			${market_label}
		</div>`
	}

	refresh(){
		$("#money").html(game.player.money);
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
			let params = Object.entries(effect.params).map(([k,v]) => `${k}: ${v}`).join(", ");
			txt += `<div>${effect.name}: ${params}</div>`
		}
		$("#effects").html(txt);
	}
}
