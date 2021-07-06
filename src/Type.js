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
	 * Validator function checks whether a value can be of this type.
	 *
	 * @since 0.0.1
	 * @constant
	 * @private
	 * @type {Function}
	 */
	#validator;

	/**
	 * Clone function which clones (deep copies) supported values and returns the cloned value
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

	/* ================================ CONSTRUCTORS ================================ */

	/**
	 * Instantiates a custom type schema from provided arguments
	 *
	 * @since 0.0.1
	 * @public
	 * @constructor
	 * @param {String} name name of the type
	 * @param {Function} clone function that handles the responsibility of cloning values of this type
	 * @param {Function} validator function that validates type of any value against this type
	 * @param {any} defaultValue default value of the type
	 * @throws {IllegalArgumentException} when type of name is not string
	 * or validator is not a function with one argument
	 * or clone is not a function with one argument
	 * or default value is undefined
	 * or the default value cannot be validated against provided validator
	 */
	constructor(name, validator, clone, defaultValue) {
		if (process.env.NODE_ENV !== 'production') {
			if (!(typeof name === 'string')) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided type name is not a valid string.'
				);
			} else if (!(validator instanceof Function && validator.length === 1)) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided function is not a valid validator function.'
				);
			} else if (!(clone instanceof Function && clone.length === 1)) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided function is not a valid clone function.'
				);
			} else if (defaultValue === undefined) {
				throw new IllegalArgumentException('Cannot create new type definition. Provided default value is undefined.');
			} else if (validator(defaultValue) !== true) {
				throw new IllegalArgumentException(
					'Cannot create new type definition. Provided default value cannot be validated using provided validator.'
				);
			}
		}

		this.#name = name;
		this.#validator = validator;
		this.#clone = clone;
		this.#defaultValue = this.clone(defaultValue);
	}

	/* ================================ LIFECYCLE METHODS ================================ */

	/**
	 * Validates provided value against this type, i.e.
	 * it checks whether a value can be of this type.
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to validate against this type
	 * @returns {Boolean} true if the provided value can be validated against this type
	 */
	validate(value) {
		return this.#validator(value);
	}

	/**
	 * Clones the provided value using the clone function of defined type
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to clone
	 * @returns {any} the cloned value
	 * @throws {IllegalArgumentException} when value cannot be validated against this type
	 */
	clone(value) {
		if (process.env.NODE_ENV !== 'production') {
			if (!this.validate(value)) {
				throw new IllegalArgumentException('Provided value cannot be validated against this type.');
			}
		}
		return this.#clone(value);
	}

	/* ================================ GETTERS ================================ */

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
	 * Getter method for accessing the default value of the type
	 *
	 * @warning
	 * Default value is theoretically constant.
	 * If the default value is an object,
	 * it is possible to manually change the default value,
	 * but it is not desirable even when you know what you are doing!
	 * It may create inconsistency issues.
	 * Immutability constraint is not enforced because,
	 * it is costly from the point of view of performance.
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {any} the default value of the type
	 */
	getDefaultValue() {
		return this.#defaultValue;
	}

	/* ================================ UTILITY ================================ */

	/**
	 * Returns the string representation of type
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {String} string representation
	 */
	toString() {
		return `Type: ${this.getName()}`;
	}
}

export default Type;
