import InterfaceError from '../error/Interface.error.js';

class ComponentPool {
	#pool;

	#pooltracker;

	#cursor;

	#poolSize;

	#totalUsed;

	constructor(ComponentClass, size) {
		this.#totalUsed = 0;
		this.#cursor = 0;
		this.#poolSize = size;
		this.#pool = new Array(size);
		this.#pooltracker = new Array(size);

		for (let index = 0; index < this.#pool.length; index += 1) {
			const component = new ComponentClass();
			this.#pool[index] = component;
			this.#pooltracker[index] = false;
		}
	}

	malloc(component) {
		if (this.#poolSize > this.#cursor) {
			if (this.#pooltracker[this.#cursor] === false) {
				this.#pool[this.#cursor].reset(component.props);
				this.#pooltracker[this.#cursor] = true;
				this.#cursor += 1;
			}
			this.#totalUsed += 1;
			return this.#cursor - 1;
		}
		for (let index = 0; index < this.#poolSize; index += 1) {
			if (this.#pooltracker[index] === false) {
				this.#cursor = index;
				this.#pool[this.#cursor].reset(component.props);
				this.#pooltracker[this.#cursor] = true;
				this.#cursor += 1;

				this.#totalUsed += 1;
				return this.#cursor - 1;
			}
		}

		throw new InterfaceError('cannot add more components to the pool. Poolsize reached limits');
	}

	free(index) {
		if (this.#pooltracker[index] === true) {
			this.#pooltracker[index] = false;
			this.#totalUsed -= 1;
		}
	}

	get totalUsed() {
		return this.#totalUsed;
	}

	get totalFree() {
		return this.#poolSize - this.#totalUsed;
	}
}

export default ComponentPool;
