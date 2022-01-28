import InterfaceError from '../error/Interface.error.js';

class ComponentPool {
	#pool;

	#size;

	#index;

	#indexTracker;

	#type;

	#totalUsed;

	/* ================================ CONSTRUCTORS ================================ */

	constructor({ type, size = 1000 }) {
		this.#pool = new Array(size);
		this.#size = size;
		this.#index = [...Array(100).keys()];
		this.#indexTracker = [...Array(100).keys()];
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

	componentAt(index) {
		if (this.isFree(index)) {
			throw new InterfaceError(`Cannot get the component at ${index}, memory at asked index is marked as free.`);
		}
		return this.#pool[index];
	}

	/* ================================ SETTERS ================================ */

	malloc(component) {
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

		const index = this.#index[this.#totalUsed];
		this.#pool[index] = component;
		this.#totalUsed += 1;
		return index;
	}

	free(index) {
		this.#totalUsed -= 1;
		const lastIndex = this.#index[this.#totalUsed];
		const positionOfIndex = this.#indexTracker[index];

		this.#index[this.#totalUsed] = index;
		this.#indexTracker[index] = this.#totalUsed;

		this.#index[positionOfIndex] = lastIndex;
		this.#indexTracker[lastIndex] = positionOfIndex;
	}

	/* ================================ UTILITY ================================ */

	isFree(index) {
		return this.#indexTracker[index] >= this.#totalUsed;
	}
}

export default ComponentPool;
