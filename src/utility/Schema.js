import SchemaNotFoundExceptionJs from '../exceptions/SchemaNotFoundException.js';
import Type from '../Type.js';

/**
 * Check if the provided schema follows the structure of a valid schema,
 * i.e. this function ensures that schema follows the schemas schema
 *
 * @since 0.0.1
 * @public
 * @exports
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

const checkInvalidSchemaAttributes = (schema, props) => {
	Object.keys(props).forEach((key) => {
		if (!Object.prototype.hasOwnProperty.call(schema, key)) {
			throw new SchemaNotFoundExceptionJs.SchemaNotFoundException(
				`Trying to set attribute '${key}' not defined in the '${schema}' schema. 
				Please fix the schema, the attribute value won't be set`
			);
		}
	});
};

export { isValidSchema, checkInvalidSchemaAttributes };
