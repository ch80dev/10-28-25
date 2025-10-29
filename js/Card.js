// Generic effect handlers
const card_effect_handlers = {

    
    boost_income: (game, player, params) => {
        player.bonus += params.amount;
        player.add_temporary_effect('boost_income', {            
            expires_in: params.expires_in,
            remove_bonus_when_expires: params.amount,
        });
    },
    gain_immediate: (game, player, params) => {
        player.earn(game,  params.amount);
        
        //console.log(`${player.name} gains $${params.amount} immediately.`);
    },

    gain_per_turn: (game, player, params) => {
        player.add_temporary_effect('income_per_turn', {            
            amount: params.amount,
            expires_in: params.expires_in
        });
        //console.log(`${player.name} will gain $${params.amount} per turn for ${params.turns} turns.`);
    },

    invest: (game, player, params) => {
        params.balance += params.amount;
    },
    play_all: (game, player, params, id) => {
        
        for (let card_id = game.hand.length - 1; card_id >= 0; card_id --){
            if (card_id == id){
                continue;
            }
            game.hand[card_id].play(game, player, card_id);            
        }
        for (let card_id in game.hand){
            game.does_card_expire(card_id);
        }


    },
    yield: (game, player, params) => {
        player.money *= params.yield
    },
    play_neighbors: (game, player, params, id) => {
        let prev_id = id - 1;
        if (prev_id >= 0){
            game.hand[prev_id].play(game, player, prev_id);            
            game.does_card_expire(prev_id);
        }
        let next_id = id + 1;
        if (next_id <= Config.hand_limit - 1 && (next_id + 1 <= game.hand.length)){
            game.hand[next_id].play(game, player, next_id);            
            game.does_card_expire(next_id);
        }
    },
    // Add other effect types here (upgrade, investment, etc.)
};

// Card class
class Card {
    // Explicit property declarations
    constructor( category, cost, effect_type, effect_params, uses = 1) {   
        //console.log( category, cost, effect_type, effect_params, uses);
        this.category = category;         // e.g., "Direct Income", "Investment", "Upgrade"
        this.cost = cost;                 // How much money it costs to play the card
        this.effect_type = effect_type;     // Which generic effect handler to use
        this.effect_params = effect_params; // Parameters specific to the effect
        this.market_expires = 5;
        this.uses = uses;                 // Number of times this card can be used
    }
    dies(){
        this.market_expires --;

    }
    // Play the card
    play(game, player, id) {

        if (this.uses != null && this.uses <= 0) {
            console.log(`${this.name} has no uses left.`);
            return;
        }

        if (this.uses != null){
            this.uses--;
        }
        const effect = card_effect_handlers[this.effect_type];
        if (effect) {
            return effect(game, player, this.effect_params, id);
        } else {
            console.log(`No effect handler for type ${this.effect_type}`);
        }
    }


}
