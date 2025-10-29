class Config {
	static loop_interval_timing = 1000;

	static card_descriptions = {
		boost_income: (params) => `+${params.amount} to income for ${params.expires_in} turn(s).`,
		gain_immediate: (params) => `+${params.amount}`,
		gain_per_turn: (params) => `+${params.amount} per turn for ${params.expires_in} turn(s).`,
		invest: (params) =>  `+${params.amount} to balance on card. (${params.balance}) 
		Gains ${(1 -params.growth_factor) * 100}% every turn. Collect balance when it is discarded.`
	}
}