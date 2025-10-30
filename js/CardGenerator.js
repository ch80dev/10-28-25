class CardGenerator {
    fetch_rand_category(game, card_class){
        const card_categories = ['finance', 'income', 'upgrade', 'play'];
        while(true){
            let rand_category = card_categories[fetch_rand(0, card_categories.length - 1)];
            let in_hand = game.is_card_in_hand('play_all');
            let in_market = game.is_card_in_market('play_all');
            if (card_class < 10 && rand_category == 'finance' 
                || (rand_category == 'play' && (in_hand || in_market)) ){
                continue;
            }
            return rand_category;    
        }
        
        
    }

    generate = { //by category
        finance: (player, card_class) => {
            let finance_types = ['yield', 'invest'];
            let card_type = finance_types[fetch_rand(0, finance_types.length - 1)];
            let total_uses = fetch_rand(3, 6);
            let growth_factor = 1 + (fetch_rand(1, 10) * .01);
            let modifier = fetch_rand(1, 3);

            
            let cost_modifier = fetch_rand(10, 30) * .01;
            if (card_type == 'invest'){
                cost_modifier *= 2;
            }
            let cost = Math.round(player.total_earned * Math.pow(growth_factor, total_uses) * cost_modifier); 
            console.log('finance', cost, card_type, growth_factor, total_uses);
            return new Card('finance', cost, card_type, { amount: card_class * modifier, growth_factor: growth_factor, balance: 0 }, total_uses, card_class);
        }, 
        
        income: (player, card_class) => {
            let income_types = ['gain_immediate', 'gain_per_turn'];
            let card_type = income_types[fetch_rand(0, income_types.length - 1)];    
            let total_uses = fetch_rand(3, 6);
            let modifier = fetch_rand(1, 3);
            let expires_in = fetch_rand(3, 6);
            let total_income = card_class * modifier * total_uses;
            let params = {amount: card_class* modifier}
            if (card_type == 'gain_per_turn'){
                total_income = card_class* modifier * total_uses * expires_in;
                params.expires_in = expires_in;
            }
            let cost_modifier = fetch_rand(10, 30) * .01;
            let cost = Math.ceil(total_income * cost_modifier);
            return new Card('income', cost, card_type, params, total_uses, card_class);
        }, 
        on_discard: (player, card_class) => {

        },
        play: (player, card_class) => {
            let play_types = ['play_all'];
            let card_type = play_types[fetch_rand(0, play_types.length - 1)];    
            let total_uses = fetch_rand(3, 6);
            let cost_modifier = .5;
            if (card_type == 'play_all'){
                cost_modifier = 1;
            }
            let cost = Math.ceil(player.total_earned * cost_modifier) + 1;
            return new Card('play', cost, card_type, {}, total_uses, card_class);
        },
        
        upgrade: (player, card_class) => {
            let card_type = 'boost_income';
            let total_uses = fetch_rand(1, 3);
            let modifier = fetch_rand(1, 3);
            let expires_in = fetch_rand(3, 6);
            let total_income = card_class* modifier * total_uses;
            let params = {amount: card_class* modifier, expires_in: expires_in}
            let cost_modifier = fetch_rand(10, 30) * .01;            
            let cost = Math.ceil(total_income * cost_modifier);
            return new Card('upgrade', cost, card_type, params, total_uses, card_class);
        }
    }

    get (game, player, card_class){        
        let rand_category = this.fetch_rand_category(game, card_class);
        for (let i = 0; i < 100; i ++){
            let card = this.generate[rand_category](player, card_class);
            if (card.cost > (player.money + 1) * 2 || (card.effect_type == 'gain_immediate' && card.effect_params.amount == 1)){
                continue;
            }
            return card;
            
        }
        console.log(rand_category, "get overloaded");
        return null;
    }

    go(game, player, card_class){
        while(true){
            let card= this.get(game, player, card_class);
            if (card != null){
                return card;
            }
        }
        


    }
}