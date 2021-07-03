/**
 * @namespace Schema
 */
import Type from '../Type.js';

/**
 * Check if the provided schema follows the structure of a valid schema,
 * i.e. this function ensures that schema follows the schemas schema
 *
 * @since 0.0.1
 * @memberof Schema
 * @public
 * @param {Object} schema the schema to check
 * @returns {Boolean} whether the provided schema is valid
 */
const isValidSchema = (schema) => {
	// if schema is null or undefined it is invalid
	if (!schema) {
		return false;
	}
	/**
	 * Attribute values of the schema.
	 * Empty schema is not valid
	 * @type {any[]}
	 */
	const attributes = Object.values(schema);
	if (attributes.length < 1) {
		return false;
	}

	return attributes.every(
		(value) => value && Object.prototype.hasOwnProperty.call(value, 'type') && value.type instanceof Type
	);
};

const checkInvalidSchemaAttributes = (schema, props) => {};

export { isValidSchema, checkInvalidSchemaAttributes };
