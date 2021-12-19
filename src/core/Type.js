import IllegalArgumentError from '../error/IllegalArgumentError.js';

/**
 * <p>
 * Type System plays a crucial role in schema definition and cloning.
 *
 * <p>
 * In schema definition when the default value of a particular type is not given
 * it is fetched from the type system. It ensures consistency and less undefined values.
 * So the default value of a newly declared type cannot be undefined.
 *
 * <p>
 * By providing a cloning method, it facilitates deep copying custom values of newly created types.
 * And with the newly added serialize and deserialize methods we can easily serialize and deserialize the components
 *
 * <p>
 * We can't guarantee 100% runtime type safety just using the type class and that's why there are test classes which
 * provides the additional benefits, so when you invent a new type, please compose the tests with care.
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
	 * @type {string}
	 */
	#name;

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
	 * Serialize function which serializes the value of this specific type
	 *
	 * @since 0.0.1
	 * @constant
	 * @private
	 * @type {Function}
	 */
	#serialize;

	/**
	 * Deserialize function which deserializes the value of this specific type
	 *
	 * @since 0.0.1
	 * @constant
	 * @private
	 * @type {Function}
	 */
	#deserialize;

	/* ================================ CONSTRUCTORS ================================ */

	/**
	 * Instantiates a custom type schema from provided arguments
	 *
	 * @since 0.0.1
	 * @public
	 * @constructor
	 * @param {object} props props of the type object
	 * @property {string} name name of the type
	 * @property {any} defaultValue default value of the type
	 * @property {Function} clone function that handles the responsibility of cloning values of this type
	 * @property {Function} validator function that validates type of any value against this type
	 * @property {Function} serialize function that serializes the value of this type
	 * @property {Function} deserialize function that deserializes the value of this type
	 * @throws {IllegalArgumentError} when type of name is not string
	 * or default value is undefined
	 * or the default value cannot be validated against provided validator
	 * or validator is not a function with one argument
	 * or clone is not a function with one argument
	 * or serialize is not a function with one argument
	 * or deserialize is not a function with one argument
	 */
	constructor({ name, defaultValue, validator, clone, serialize, deserialize }) {
		this.#validator = validator;

		if (process.env.NODE_ENV !== 'production') {
			if (!(typeof name === 'string')) {
				throw new IllegalArgumentError('Cannot create new type definition. Provided type name is not a valid string.');
			} else if (!(validator instanceof Function && validator.length === 1)) {
				throw new IllegalArgumentError(
					'Cannot create new type definition. Provided function is not a valid validator function.'
				);
			} else if (!(clone instanceof Function && clone.length === 1)) {
				throw new IllegalArgumentError(
					'Cannot create new type definition. Provided function is not a valid clone function.'
				);
			} else if (defaultValue === undefined) {
				throw new IllegalArgumentError('Cannot create new type definition. Provided default value is undefined.');
			} else if (this.validate(defaultValue) !== true) {
				throw new IllegalArgumentError(
					'Cannot create new type definition. Provided default value cannot be validated using provided validator.'
				);
			} else if (!(serialize instanceof Function && serialize.length === 1)) {
				throw new IllegalArgumentError(
					'Cannot create new type definition. Provided function is not a valid serialize function.'
				);
			} else if (!(deserialize instanceof Function && deserialize.length === 1)) {
				throw new IllegalArgumentError(
					'Cannot create new type definition. Provided function is not a valid deserialize function.'
				);
			}
		}

		this.#name = name;
		this.#clone = clone;
		this.#defaultValue = this.clone(defaultValue);
		this.#serialize = serialize;
		this.#deserialize = deserialize;
		Object.preventExtensions(this);
	}

	/* ================================ LIFECYCLE METHODS ================================ */

	/**
	 * Validates provided value against this type, i.e.
	 * it checks whether a value can be of this type.
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to validate against this type
	 * @returns {boolean} true if the provided value can be validated against this type
	 */
	validate(value) {
		try {
			return this.#validator(value);
		} catch (error) {
			return false;
		}
	}

	/**
	 * Clones the provided value using the clone function of defined type
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to clone
	 * @returns {any} the cloned value
	 * @throws {IllegalArgumentError} when value cannot be validated against this type
	 */
	clone(value) {
		if (process.env.NODE_ENV !== 'production') {
			if (!this.validate(value)) {
				throw new IllegalArgumentError('Provided value cannot be validated against this type.');
			}
		}
		return this.#clone(value);
	}

	/**
	 * Serialize the provided value using the serialize function of defined type
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to serialize
	 * @returns {any} the serialized value
	 * @throws {IllegalArgumentError} when value cannot be validated against this type
	 */
	serialize(value) {
		if (process.env.NODE_ENV !== 'production') {
			if (!this.validate(value)) {
				throw new IllegalArgumentError('Provided value cannot be validated against this type.');
			}
		}
		return this.#serialize(value);
	}

	/**
	 * Deserialize the provided value using the deserialize function of defined type
	 *
	 * @since 0.0.1
	 * @public
	 * @param {any} value the value to deserialize
	 * @returns {any} the deserialized value
	 * @throws {IllegalArgumentError} when deserialized value cannot be validated against this type
	 */
	deserialize(value) {
		const deserializedValue = this.#deserialize(value);
		if (process.env.NODE_ENV !== 'production') {
			if (!this.validate(deserializedValue)) {
				throw new IllegalArgumentError('Deserialized value cannot be validated against this type.');
			}
		}
		return deserializedValue;
	}

	/* ================================ GETTERS ================================ */

	/**
	 * Getter method for accessing the type name
	 *
	 * @since 0.0.1
	 * @public
	 * @returns {string} the name of the type
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
	 * @returns {string} string representation
	 */
	toString() {
		return `Type: ${this.getName()}`;
	}
}

export default Type;
