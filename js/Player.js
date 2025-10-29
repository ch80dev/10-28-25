const player_effect_handlers = {
    income_per_turn: {
        apply: (game, player, params) => {               
            player.earn(game, params.amount);
            console.log('EFFECT: income_per_turn ', params.amount);
        }, remove: (player, params) => {        
         
        }
    },

    boost_income: {
        apply: (game, player, params) => {        
            console.log('EFFECT: boost_income - still active');
        }, remove: (player, params) => {        
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
        let new_card_class = Math.ceil(this.total_earned / 10);
        if (new_card_class > game.card_class){
            game.card_class = new_card_class;
        }
    }

    spend(amount){
        if (this.money < amount){
            return false;
        }
        this.money -= amount;
    }
    run_effects(game){
        console.log('run', this.effects.length);
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            player_effect_handlers[effect.name].apply(game, this, effect.params);
            if (effect.params.expires_in !== undefined) effect.params.expires_in -= 1;
            console.log(effect.params.expires_in);
            if (effect.params.expires_in <= 0 && player_effect_handlers[effect.name].remove) {
                player_effect_handlers[effect.name].remove(game, this, effect.params);
                this.effects.splice(i, 1);
            }
        }

    }
}