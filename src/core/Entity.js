/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import InterfaceError from '../error/InterfaceError.js';

/**
 * Abstract base class Entity provides solid foundation for other entity types to extend.
 *
 * Entities are composition of components
 *
 * @since 0.0.1
 * @public
 * @abstract
 * @class
 */
class Entity {
	#componentIndexes;

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
	 * Init method gets executed after the entity is initialized
	 */
	init() {}

	/**
	 * TODO: why entity should update
	 */
	update() {}

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
	 *
	 * @param {string} name
	 */
	getComponent({ name }) {}

	/**
	 *
	 */
	getComponents() {}

	/* ================================ SETTERS ================================ */

	addComponent(...components) {}

	removeComponent({ name }) {}

	/* ================================ UTILITY ================================ */

	clone() {}

	serialize() {}

	deserialize() {}
}

export default Entity;
