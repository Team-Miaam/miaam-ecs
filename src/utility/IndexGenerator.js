import InterfaceError from '../error/Interface.error.js';

class IndexGenerator {
	#size;

	#totalUsed;

	#index;

	#indexTracker;

	constructor({ size = 64 }) {
		this.#size = size;
		this.#index = [...Array(size).keys];
		this.#indexTracker = [...Array(size).keys];
		this.#totalUsed = 0;
	}

	get size() {
		return this.#size;
	}

	get totalUsed() {
		return this.#totalUsed;
	}

	get totalFree() {
		return this.#size - this.#totalUsed;
	}

	get nextFreeIndex() {
		if (this.totalFree === 0) {
			throw new InterfaceError(`Cannot generate id, max size limit reached, max size is ${this.size}`);
		}

		const index = this.#index[this.#totalUsed];
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

	get indexes() {
		return this.#index.slice(this.#totalUsed);
	}
}

export default IndexGenerator;
