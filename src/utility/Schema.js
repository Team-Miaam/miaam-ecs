/**
 * @module utils/Schema
 */
import IllegalArgumentError from '../error/IllegalArgument.error.js';
import InterfaceError from '../error/Interface.error.js';
import Type from '../core/Type.js';

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

	const attributeCriterion = [
		(attribute) => Object.prototype.hasOwnProperty.call(attribute, 'type') && attribute.type instanceof Type,
		(attribute) => {
			if (Object.prototype.hasOwnProperty.call(attribute, 'serialize')) {
				return typeof attribute.serialize === 'boolean';
			}
			return true;
		},
	];

	return attributes.every((attribute) =>
		attributeCriterion
			.map((criteria) => {
				try {
					return criteria(attribute);
				} catch (error) {
					if (error instanceof TypeError) {
						return false;
					}
					throw error;
				}
			})
			.every((assertion) => assertion === true)
	);
};

/**
 * Checks whether attributes in the properties are compliant with the provided schema
 *
 * @since 0.0.1
 * @public
 * @param {Object} schema valid schema to check against
 * @param {Object} props attributes of property to check
 * @throws {InterfaceError} when there are attributes non-compliant with the schema
 */
const checkSchemaProps = (schema, props) => {
	if (!schema || !props) {
		throw new IllegalArgumentError('Cannot initiate checking. Provided props is either null or undefined.');
	}
	// This utility function is mainly devised to be compliant with the component update method
	// and since update doesn't require all the attributes, so we are looping over the props instead of schema
	const invalidProps = Object.keys(props).filter(
		(key) => !(Object.prototype.hasOwnProperty.call(schema, key) && schema[key].type.validate(props[key]))
	);

	if (invalidProps.length > 0) {
		throw new InterfaceError(
			`Found non-compliant attributes: {${invalidProps}}. Property attributes are non-compliant with the schema.`
		);
	}
};

export { isValidSchema, checkSchemaProps };
