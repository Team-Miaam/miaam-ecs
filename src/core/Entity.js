/* eslint-disable class-methods-use-this */
import Scene from './Scene.js';

import InterfaceError from '../error/Interface.error.js';
import IntegrationError from '../error/Integration.error.js';
import IllegalArgumentError from '../error/IllegalArgument.error.js';

/**
 * Abstract base class Entity provides solid foundation for other entity types to extend.
 *
 * Although entities are composition of components, but entities don't store the components itself,
 * the components are originally stored in the scene class and entity class holds a reference.
 *
 * @since 0.0.1
 * @public
 * @abstract
 * @class
 */
class Entity {
	#id;

	/**
	 * @type {Scene}
	 */
	#scene;

	/* ================================ CONSTRUCTORS ================================ */
	constructor() {
		if (process.env.NODE_ENV !== 'production') {
			if (this.constructor === Entity) {
				throw new InterfaceError('Cannot instantiate Entity class. Entity class is abstract.');
			}
		}
	}

	/* ================================ LIFECYCLE METHODS ================================ */

	/**
	 * Init method gets executed after the entity is initialized and associated to a scene.
	 * So primarily all of the component associated works should be processed after/when the init function is called.
	 */
	init() {}

	/**
	 * destroy method gets executed just before a entity gets destroyed
	 */
	destroy() {}

	/**
	 * Resets a entity from passed down properties using life cycle methods.
	 *
	 * @note
	 * This lifecycle method would be hugely helpful in implementing the pool pattern
	 * of same type of components, the reset method will be particularly helpful for reclaiming
	 * the dead objects in the pool
	 *
	 * @since 0.0.1
	 * @public
	 */
	reset() {}

	/* ================================ GETTERS ================================ */

	get id() {
		return this.#id;
	}

	/**
	 * Returns an array of {componentId: [component, index]} when one or more components are provided in the arguments
	 * otherwise returns all the components i.e. when the argument array is empty.
	 *
	 * @param {Array} componentTypes
	 */
	getComponent(...componentTypes) {
		if (process.env.NODE_ENV !== 'production') {
			if (this.#scene === undefined) {
				throw new IntegrationError('Cannot get components, entity is not associated with a scene');
			}
		}

		return this.scene.getComponent(this.#id, componentTypes);
	}

	getAllComponents() {
		if (process.env.NODE_ENV !== 'production') {
			if (this.#scene === undefined) {
				throw new IntegrationError('Cannot get components, entity is not associated with a scene');
			}
		}

		return this.scene.getAllComponents(this.#id);
	}

	get scene() {
		return this.#scene;
	}

	/* ================================ SETTERS ================================ */

	set id(id) {
		this.#id = id;
	}

	addComponent(...components) {
		if (process.env.NODE_ENV !== 'production') {
			if (this.#scene === undefined) {
				throw new IntegrationError('Cannot add components, entity is not associated with a scene');
			}
		}

		this.#scene.addComponent(this.#id, ...components);
	}

	removeComponent(...componentTypes) {
		if (process.env.NODE_ENV !== 'production') {
			if (this.#scene === undefined) {
				throw new IntegrationError('Cannot remove components, entity is not associated with a scene');
			}
		}

		this.scene.removeComponent(this.#id, componentTypes);
	}

	removeAllComponents() {
		if (process.env.NODE_ENV !== 'production') {
			if (this.#scene === undefined) {
				throw new IntegrationError('Cannot remove components, entity is not associated with a scene');
			}
		}

		this.scene.removeAllComponents(this.#id);
	}

	set scene(scene) {
		if (process.env.NODE_ENV !== 'production') {
			if (!scene) {
				throw new IllegalArgumentError(`Cannot set scene, provided scene is either null or undefined`);
			} else if (!(scene instanceof Scene)) {
				throw new IllegalArgumentError(`Cannot set scene, provided scene is not an instance of scene class`);
			}
		}

		this.#scene = scene;
	}

	/* ================================ UTILITY ================================ */

	clone() {}

	serialize() {}

	static deserialize() {}
}

export default Entity;
