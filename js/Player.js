const player_effect_handlers = {
    income_per_turn: {
        apply: (game, player, params) => {               
            player.earn(game, params.amount);
        }, remove: (player, params) => {        
         
        }
    },

    boost_income: {
        apply: (game, player, params) => {        
        }, remove: (game, player, params) => {     
            player.bonus -= params.remove_bonus_when_expires;
        }
    }
}

class Player {
    bonus = 0;
    effects = [];
    money = 0;
    total_earned = 0;
    add_temporary_effect(name, params){
        this.effects.push({ name: name, params: params });
    }

    earn(game, amount){
        this.money += amount + this.bonus;
        this.total_earned += amount + this.bonus;
        let new_card_class = this.get_card_class(this.total_earned);
        if (new_card_class > game.card_class){
            game.card_class = new_card_class;
        }
    }
    get_card_class(n) {
        if (n < 101) return 1; // handle 0 or negatives gracefully
        const pow = Math.floor(Math.log10(n) / 2); // number of digits - 1
        return Math.pow(100, pow);
    }
    spend(amount){
        if (this.money < amount){
            return false;
        }
        this.money -= amount;
    }
    run_effects(game){
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            player_effect_handlers[effect.name].apply(game, this, effect.params);
            if (effect.params.expires_in !== undefined) effect.params.expires_in -= 1;
            if (effect.params.expires_in <= 0 && player_effect_handlers[effect.name].remove) {
                player_effect_handlers[effect.name].remove(game, this, effect.params);
                this.effects.splice(i, 1);
            }
        }

    }
}