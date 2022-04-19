class Query {
	#dml;

	constructor(dml) {
		this.#dml = dml;
	}

	*run({ components, entities }) {
			const mustHave = this.#dml.components.and;
			entities.map((entityId) => {
				const entity = Object.fromEntries(mustHave.map((type) => [type, components[type].getComponent(entityId)]));
				const isEligible = Object.values(entity).filter((value) => value !== undefined).length === mustHave.length;
				if(isEligible) {
					yield entity;
				}
			});
	}
}

export default Query;
