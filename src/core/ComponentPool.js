import InterfaceError from '../error/Interface.error.js';

const FREE = -1;
class ComponentPool {
	#pool;

	#componentIndexes;

	#entities;

	#size;

	#type;

	#totalUsed;

	/* ================================ CONSTRUCTORS ================================ */

	constructor({ type, maxComponents = 1000, maxEntities = 64 }) {
		this.#pool = new Array(maxComponents);
		this.#componentIndexes = new Array(maxEntities).fill(FREE);
		this.#entities = new Array(maxComponents);
		this.#size = maxComponents;
		this.#type = type;
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

	getComponent(entity) {
		const componentIndex = this.#componentIndexes[entity];
		return this.#pool[componentIndex];
	}

	/* ================================ SETTERS ================================ */

	malloc(entity, component) {
		if (process.env.NODE_ENV !== 'production') {
			if (!(component instanceof this.#type)) {
				throw new InterfaceError(
					`Cannot allocate memory for component, component is not an instance of provisioned class ${this.#type.name}.`
				);
			}
		}
		if (this.totalFree === 0) {
			throw new InterfaceError(
				`Cannot allocate memory for component, pool size limit reached, max size is ${this.size}`
			);
		}

		this.#pool[this.#totalUsed] = component;
		this.#componentIndexes[entity] = this.#totalUsed;
		this.#entities[this.#totalUsed] = entity;

		this.#totalUsed += 1;
		return this.#totalUsed - 1;
	}

	free(entity) {
		this.#totalUsed -= 1;

		const componentIndex = this.#componentIndexes[entity];
		const entityToBeSwapped = this.#entities[this.#totalUsed];

		this.#entities[componentIndex] = entityToBeSwapped;
		this.#componentIndexes[entityToBeSwapped] = componentIndex;
		this.#componentIndexes[componentIndex] = FREE;
		this.#pool[componentIndex] = this.#pool[this.#totalUsed];
	}

	/* ================================ UTILITY ================================ */

	hasComponent(entity) {
		const componentIndex = this.#componentIndexes[entity];
		return componentIndex !== FREE;
	}
}

export default ComponentPool;
