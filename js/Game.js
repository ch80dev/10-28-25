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
		this.hand.push(new Card('income', 0, 'gain_immediate', {amount: 1}, null ));
		this.add_card_to_market();
	}

	add_card_to_market(){
		this.market.push(this.card_generator.go(this.player, this.card_class));
	}

	buy(id){
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
		console.log('discarding', id, typeof id)
		let card = this.hand[id];
		if (card.effect_type == 'invest'){
			console.log('INVEST VESTEd', card.effect_params, card.effect_params.balance);
			this.player.earn(card.effect_params.balance);
		}
		
		this.hand.splice(id, 1);
	}

	does_card_expire(id){
		console.log(id, 'play() [54] - error', this.hand, this.hand[id].uses, this.hand[id].uses !== null, this.hand[id].uses < 1);
		if (this.hand[id].uses !== null && this.hand[id].uses < 1 ){
			this.discard(id);
		}
	}

	play(id){
		this.hand[id].play(this, this.player, id);
		for (let card of this.market){
			card.dies();			
		}
        this.market = this.market.filter( card => card.market_expires > 0);
		this.add_card_to_market();
		this.does_card_expire(id);	
	}

	do_turn(){
		this.player.run_effects(this);
		for (let card of this.hand){
			if (card.effect_type == 'invest'){
				console.log(card.effect_params);
				card.effect_params.balance = Math.round(card.effect_params.balance * card.effect_params.growth_factor);
			}			
		}
		this.turns ++;
		console.log(this.player.bonus);
	}
}
