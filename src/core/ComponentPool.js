import InterfaceError from '../error/Interface.error.js';

const FREE = -1;
class ComponentPool {
	#pool;

	#componentIndexes;

	#entityIds;

	#size;

	#totalUsed;

	/* ================================ CONSTRUCTORS ================================ */

	constructor({ maxComponents = 64, maxEntities = 64 }) {
		this.#pool = new Array(maxComponents);
		this.#componentIndexes = new Array(maxEntities).fill(FREE);
		this.#entityIds = new Array(maxComponents);
		this.#size = maxComponents;
		this.#totalUsed = 0;
	}

	/* ================================ GETTERS ================================ */

	get size() {
		return this.#size;
	}

	get totalUsed() {
		return this.#totalUsed;
	}

	get totalFree() {
		return this.size - this.#totalUsed;
	}

	getComponent(entityId) {
		const componentIndex = this.#componentIndexes[entityId];
		return this.#pool[componentIndex];
	}

	/* ================================ SETTERS ================================ */

	malloc(entityId, component) {
		if (this.totalFree === 0) {
			throw new InterfaceError(
				`Cannot allocate memory for component, pool size limit reached, max size is ${this.size}`
			);
		}

		this.#pool[this.#totalUsed] = component;
		this.#componentIndexes[entityId] = this.#totalUsed;
		this.#entityIds[this.#totalUsed] = entityId;

		this.#totalUsed += 1;
	}

	free(entityId) {
		this.#totalUsed -= 1;

		const componentIndex = this.#componentIndexes[entityId];
		const entityToBeSwapped = this.#entityIds[this.#totalUsed];

		this.#entityIds[componentIndex] = entityToBeSwapped;
		this.#componentIndexes[entityToBeSwapped] = componentIndex;
		this.#componentIndexes[componentIndex] = FREE;
		this.#pool[componentIndex] = this.#pool[this.#totalUsed];
	}

	/* ================================ UTILITY ================================ */

	hasComponent(entityId) {
		const componentIndex = this.#componentIndexes[entityId];
		return componentIndex !== FREE;
	}
}

export default ComponentPool;
