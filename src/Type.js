import IllegalArgumentException from './exceptions/IllegalArgumentException.js';

/**
 * Type System plays a crucial role in schema definition and cloning.
 *
 * In schema definition when the default value of a particular type is not given
 * it is fetched from the type system. It ensures consistency and less undefined values.
 * So the default value of a newly declared type cannot be undefined.
 *
 * By providing a cloning method, it facilitates deep copying custom values of newly created types.
 *
 * @todo write examples and tutorials
 * @since 0.0.1
 * @class
 * @public
 * @exports
 */
class Type {
	/**
	 * Name of the type
	 *
	 * @since 0.0.1
	 * @constant
	 * @private
	 * @type {String}
	 */
	#name;

	/**
	 * Clone method which clones (deep copies) supported values and returns the cloned value
	 *
	 * @since 0.0.1
	 * @constant
	 * @private
	 * @type {Function}
	 */
	#clone;

	/**
	 * Default value of the type when not initialized
	 *
	 * @since 0.0.1
	 * @constant
	 * @private
	 * @type {any}
	 */
	#defaultValue;

	/**
	 * Instantiates a custom type schema from provided arguments
	 *
	 * @since 0.0.1
	 * @param {String} name name of the type
	 * @param {Function} clone function that handles the responsibility of cloning values of this type
	 * @param {any} defaultValue default value of the type
	 * @returns {Type} a newly created instance of Type class
	 */
	static Create(name, clone, defaultValue) {
		if (process.env.NODE_ENV !== 'production') {
			if (!(typeof name === 'string' || name instanceof String)) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided type name is not a valid string'
				);
			}
			if (!(clone instanceof Function && clone.length === 1)) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided function is not a valid clone function.'
				);
			}
			if (defaultValue === undefined) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided default value is undefined.'
				);
			}
		}

		const newType = new Type();
		newType.#name = name;
		newType.#clone = clone;
		newType.#defaultValue = newType.clone(defaultValue);
		return newType;
	}

	/**
	 * Getter method for accessing the type name
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {String} the name of the type
	 */
	getName() {
		return this.#name;
	}

	/**
	 * Clones the provided value using the clone function of defined type
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to clone
	 * @returns {any} the cloned value
	 */
	clone(value) {
		return this.#clone(value);
	}

	/**
	 * Getter method for accessing the default value of the type
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {any} the default value of the type
	 */
	getDefaultValue() {
		return this.clone(this.#defaultValue);
	}
}

export default Type;
