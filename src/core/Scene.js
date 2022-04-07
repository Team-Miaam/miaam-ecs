import InterfaceError from '../error/Interface.error.js';
import IndexGenerator from '../utility/IndexGenerator.js';
import ComponentPool from './ComponentPool.js';

class Scene {
	#components;

	#systems;

	#entityIdGenerator;

	/* ================================ CONSTRUCTORS ================================ */
	constructor({ maxEntities = 64 }) {
		if (process.env.NODE_ENV !== 'production') {
			if (this.constructor === Scene) {
				throw new InterfaceError('Cannot instantiate Scene class. Scene class is abstract.');
			}
		}

		this.#components = {};
		this.#systems = {};

		this.#entityIdGenerator = new IndexGenerator({ size: maxEntities });
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

	getComponent(entityId, ...componentTypes) {
		return componentTypes.map((type) => this.#components[type].getComponent(entityId));
	}

	getAllComponents(entityId) {
		return Object.fromEntries(
			Object.entries(this.#components)
				.filter(([, componentPool]) => componentPool.hasComponent(entityId))
				.map(([type, componentPool]) => [type, componentPool.getComponent(entityId)])
		);
	}

	getSystem(...systemIds) {
		return systemIds.map((id) => this.#systems[id]);
	}

	/* ================================ SETTERS ================================ */

	addComponent(entityId, ...components) {
		components.forEach((component) => {
			const type = component.constructor.name;
			if (!this.#components[type]) {
				this.#components[type] = new ComponentPool({});
			}
			const componentPool = this.#components[type];
			componentPool.malloc(entityId, component);
			component.init();
		});
	}

	removeComponent(entityId, ...componentTypes) {
		componentTypes.forEach((type) => {
			// FIXME: add error control for non existent component types
			const componentPool = this.#components[type];
			const component = componentPool.getComponent(entityId);
			component.destroy();
			componentPool.free(entityId);
		});
	}

	removeAllComponents(entityId) {
		this.removeComponent(
			entityId,
			Object.keys(this.#components).filter((type) => this.#components[type].hasComponent(entityId))
		);
	}

	addEntity(...entities) {
		entities.forEach((entity) => {
			entity.setId(this.#entityIdGenerator.nextFreeIndex);
			entity.setScene(this);
			entity.init();
		});
	}

	removeEntity(...entities) {
		entities.forEach((entity) => {
			const entityId = entity.id;
			this.removeAllComponents(entityId);
			entity.destroy();
			this.#entityIdGenerator.free(entityId);
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
