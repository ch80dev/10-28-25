class Game{
	card_class = 1;
	card_generator = new CardGenerator();
	hand = [];
	loop = new Loop();
	market = [];
	player = new Player();

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
		if (this.player.money < card.cost + id){
			return;
		}
		if (this.hand.length > Config.hand_limit){
			this.discard(0);
		}
		this.hand.push(this.market.splice(id, 1)[0]);
		this.player.spend(card.cost + id);
		this.do_turn();
	}

	discard(id){
		let card = this.hand[id];
		if (card.effect_type == 'invest'){
			this.player.earn(card.effect_params.balance);
		}
		this.hand.splice(id, 1);
	}

	play(id){
		this.hand[id].play(this, this.player);
		for (let card of this.market){
			card.dies();			
		}
        this.market = this.market.filter( card => card.market_expires > 0);		
		this.add_card_to_market();
		if (this.hand[id].uses != null && this.hand[id].uses < 1 ){
			this.discard(id);
		}		
		this.do_turn();
	}
	do_turn(){
		this.player.run_effects(this);
		for (let card of this.hand){
			if (card.effect_type == 'invest'){
				card.effect_params.balance *= card.effect_params.growth_factor;
			}
			
		}
	}
}
