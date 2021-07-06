/**
 * TODO Categorize documentation
 */
import IllegalArgumentException from '../exceptions/IllegalArgumentException.js';
import InterfaceException from '../exceptions/InterfaceException.js';
import Type from '../Type.js';

/**
 * Check if the provided schema follows the structure of a valid schema,
 * i.e. this function ensures that schema follows the schemas schema
 *
 * @since 0.0.1
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

/**
 * Checks whether attributes in the properties are compliant with the provided schema
 *
 * @since 0.0.1
 * @public
 * @param {Object} schema valid schema to check against
 * @param {Object} props attributes of property to check
 * @throws {InterfaceException} when there are attributes non-compliant with the schema
 */
const checkSchemaProps = (schema, props) => {
	if (!schema || !props) {
		throw new IllegalArgumentException('Cannot initiate checking. Provided props is either null or undefined.');
	}
	const invalidProps = [];
	Object.keys(props).forEach((key) => {
		if (!Object.prototype.hasOwnProperty.call(schema, key)) {
			invalidProps.push(key);
		}
	});

	if (invalidProps.length > 0) {
		throw new InterfaceException(
			`Found non-compliant attributes: {${invalidProps}}. Property attributes are non-compliant with the schema.`
		);
	}
};

export { isValidSchema, checkSchemaProps };
