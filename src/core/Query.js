class Query {
	#dml;

	constructor(dml) {
		this.#dml = dml;
	}

	*run({ components, entities }) {
		yield this.#dml;
	}
}

export default Query;
