class Game{
	card_class = 1;
	card_generator = new CardGenerator();
	hand = [];
	loop = new Loop();
	market = [];
	player = new Player();
	turns = 0;
	constructor(){
		setInterval(this.loop.go(), Config.loop_interval_timing);
		this.hand.push(new Card('income', 0, 'gain_immediate', {amount: 1}, null, this.card_class ));
		this.add_card_to_market();
	}

	add_card_to_market(){
		this.market.push(this.card_generator.go(this, this.player, this.card_class));
	}

	buy(id){
		if (this.turns >= Config.max_turns){
			return;
		}
		let card = this.market[id];
		if (this.player.money < card.cost){
			return;
		}
		
		this.hand.push(this.market.splice(id, 1)[0]);
		if (this.hand.length > Config.hand_limit){
			this.discard(0);
		}
		this.player.spend(card.cost);
	}
	

	discard(id){
		let card = this.hand[id];
		if (card.effect_type == 'invest'){
			this.player.earn(this, card.effect_params.balance);
		}
		this.hand.splice(id, 1);
	}

	does_card_expire(uid){
		for (let id in this.hand){
			id = Number(id);
			let card = this.hand[id]
			if (card.uid != uid){
				continue;
			}
			if (this.hand[id].uses !== null && this.hand[id].uses < 1 ){
				this.discard(id);
			}
		}
	}

	do_turn(){
		this.player.run_effects(this);
		for (let card of this.hand){
			if (card.effect_type == 'invest'){
				card.effect_params.balance = Math.round(card.effect_params.balance * card.effect_params.growth_factor);
			}			
		}
		this.turns ++;
		if (this.turns >= Config.max_turns){
			$('#game_overlay')
  				.css('pointer-events', 'auto') // block input after fade in
  				.css('opacity', 1);  
		}

	}

	is_card_in_hand(type){
		for (let card of this.hand){
			if (card.effect_type == type){
				return true;
			}
		}
		return false;
	}

	is_card_in_market(type){
		for (let card of this.market){
			if (card.effect_type == type){
				return true;
			}
		}
		return false;
	}

	play(id){
		if (this.turns >= Config.max_turns){
			return;
		}
		let card = this.hand[id];
		let uid = card.uid;
		card.play(this, this.player, id);
		for (let card of this.market){
			card.dies();			
		}
        this.market = this.market.filter( card => card.market_expires > 0);
		this.add_card_to_market();
		
		this.does_card_expire(uid);	
	}


}
