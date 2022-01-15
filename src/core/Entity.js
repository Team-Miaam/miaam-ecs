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
	#componentIndexes;

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
	 * Pre-init method gets executed just before a entity is initialized.
	 * <br>
	 * This function runs before any of the properties of the entity is initialized
	 * when the entity is instantiated or reset.
	 *
	 * @since 0.0.1
	 * @public
	 */
	preInit() {}

	/**
	 * Init method gets executed after the entity is initialized and associated to a scene.
	 * So primarily all of the component associated works should be processed after/when the init function is called.
	 */
	init() {}

	/**
	 * Pre-destroy method gets executed just before a entity gets destroyed
	 */
	preDestroy() {}

	/**
	 * Post-destroy method gets executed after a entity is destroyed
	 */
	postDestroy() {}

	/**
	 * Destroys the entity
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

	/**
	 * Returns an array of {componentId: [component, index]} when one or more components are provided in the arguments
	 * otherwise returns all the components i.e. when the argument array is empty.
	 *
	 * @param {Array} componentIds
	 */
	getComponent(...componentIds) {
		const componentsIndexes = componentIds.map((id) => this.#componentIndexes[id]);
		this.scene.getComponent(componentsIndexes);
	}

	get scene() {
		return this.#scene;
	}

	/* ================================ SETTERS ================================ */

	addComponent(...components) {
		if (process.env.NODE_ENV !== 'production') {
			if (this.#scene === undefined) {
				throw new IntegrationError('Cannot add components, entity is not associated with a scene');
			}
		}

		const componentsOnly = components.map(({ component }) => component);
		const indexes = this.scene.addComponent(componentsOnly);
		const idsOnly = components.map(({ id }) => id);
		idsOnly.forEach((id, index) => {
			this.#componentIndexes[id] = { type: componentsOnly[index], index: indexes[index] };
		});
	}

	removeComponent(...componentIds) {
		this.scene.removeComponent(componentIds.map((id) => this.#componentIndexes[id]));
	}

	set scene(scene) {
		if (process.env.NODE_ENV !== 'production') {
			if (!scene) {
				throw new IllegalArgumentError(`Cannot set scene, provided scene is either null or undefined`);
			} else if (!(scene instanceof Scene)) {
				throw new IllegalArgumentError(`Cannot set scene, provided scene is not an instance of scene class`);
			}
		}
	}

	/* ================================ UTILITY ================================ */

	clone() {}

	serialize() {}

	static deserialize() {}
}

export default Entity;
