class Config {
	static hand_limit = 5;
	static loop_interval_timing = 1000;

	static card_descriptions = {
		boost_income: (params) => `+${params.amount} to income for ${params.expires_in} turn(s).`,
		gain_immediate: (params) => `+${params.amount}`,
		gain_per_turn: (params) => `+${params.amount} per turn for ${params.expires_in} turn(s).`,
		invest: (params) =>  `+${params.amount} to card. (${params.balance}) 
		Gains ${Math.round((params.growth_factor - 1) * 100)}% every turn. Collect balance when it is discarded.`,
		play_all: (params) =>  `Play all cards in hand.`,
		play_neighbors: (params) =>  `Play adjacent cards to this`,
		yield: (params, money) =>  `+${Math.round(params.growth_factor - 1 * money)} (+${Math.round((params.growth_factor - 1) * 100)}% of balance)`,
	};

	static effect_descriptions = {
		boost_income: (params) => `+${params.remove_bonus_when_expires} to income for ${params.expires_in} turn(s)`,
		income_per_turn: (params) => `+${params.amount} per turn for ${params.expires_in} turn(s)`,
	};
}