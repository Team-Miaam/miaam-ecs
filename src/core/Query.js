class Query {
	#dml;

	constructor(dml) {
		this.#dml = dml;
	}

	run({ components, entities }) {
		const mustHave = this.#dml.components.and;
		const refinedEntities = [];
		entities.forEach((entityId) => {
			const entity = Object.fromEntries(
				mustHave.map((type) => [type.name, components[type.name].getComponent(entityId)])
			);
			const isEligible = Object.values(entity).filter((value) => value !== undefined).length === mustHave.length;
			if (isEligible) {
				refinedEntities.push(entity);
			}
		});

		return refinedEntities;
	}
}

export default Query;
