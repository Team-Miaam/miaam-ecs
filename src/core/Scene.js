import InterfaceError from '../error/Interface.error.js';

class Scene {
	#entities;

	#components;

	#systems;

	/* ================================ CONSTRUCTORS ================================ */
	constructor() {
		if (process.env.NODE_ENV !== 'production') {
			if (this.constructor === Scene) {
				throw new InterfaceError('Cannot instantiate Scene class. Scene class is abstract.');
			}
		}

		this.#entities = {};
		this.#components = {};
		this.#systems = {};
	}

	/* ================================ LIFECYCLE METHODS ================================ */

	// eslint-disable-next-line class-methods-use-this
	init() {}

	update() {
		Object.values(this.#systems).forEach((system) => {
			system.beforeUpdate();
			system.update();
			system.afterUpdate();
		});
	}

	// eslint-disable-next-line class-methods-use-this
	destroy() {}

	/* ================================ GETTERS ================================ */

	getComponent(...componentIndexes) {
		return componentIndexes.map(({ type, index }) => this.#components[type][index]);
	}

	getEntity(...entityIds) {
		return entityIds.map((id) => this.#entities[id]);
	}

	getSystem(...systemIds) {
		return systemIds.map((id) => this.#systems[id]);
	}

	/* ================================ SETTERS ================================ */

	addComponent(...components) {
		const indexes = components.map((component) => {
			const componentPool = this.#components[component.constructor.name];
			const index = componentPool.malloc(component);
			component.init();
			return index;
		});

		return indexes;
	}

	removeComponent(...componentIndexes) {
		componentIndexes.forEach(({ type, index }) => {
			const componentPool = this.#components[type];
			componentPool[index].destroy();
			componentPool.free(index);
		});
	}

	addEntity(...entities) {
		entities.forEach(({ id, entity }) => {
			this.#entities[id] = entity;
		});
	}

	removeEntity(...ids) {
		ids.forEach((id) => {
			const entity = this.#entities[id];
			entity.preDestroy();
			delete this.#entities[id];
			entity.postDestroy();
		});
	}

	addSystem(...systems) {
		systems.forEach(({ id, system }) => {
			this.#systems[id] = system;
			system.init();
		});
	}

	removeSystem(...systemIds) {
		systemIds.forEach((id) => {
			const system = this.#systems[id];
			system.destroy();
			delete this.#systems[id];
		});
	}

	/* ================================ UTILITY ================================ */

	// eslint-disable-next-line class-methods-use-this
	clone() {}

	// eslint-disable-next-line class-methods-use-this
	serialize() {}

	static deserialize() {}
}

export default Scene;
