/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
class System {
	#query;

	// eslint-disable-next-line no-useless-constructor
	constructor({ query }) {
		this.#query = query;
	}

	init() {}

	beforeUpdate() {}

	update() {}

	afterUpdate() {}

	destroy() {}

	get query() {
		return this.#query;
	}
}

export default System;
