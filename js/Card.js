// Generic effect handlers
const card_effect_handlers = {

    yield: (game, player, params) => {
        player.money *= params.yield
    },
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

    // Add other effect types here (upgrade, investment, etc.)
};

// Card class
class Card {
    // Explicit property declarations
    constructor( category, cost, effect_type, effect_params, uses = 1) {   
        console.log( category, cost, effect_type, effect_params, uses);
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
    play(game, player) {

        if (this.uses != null && this.uses <= 0) {
            console.log(`${this.name} has no uses left.`);
            return;
        }

        if (this.uses != null){
            this.uses--;
        }
        const effect = card_effect_handlers[this.effect_type];
        if (effect) {
            return effect(game, player, this.effect_params);
        } else {
            console.log(`No effect handler for type ${this.effect_type}`);
        }
    }


}
