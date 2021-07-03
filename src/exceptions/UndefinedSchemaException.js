/**
 * Undefined Schema Exception can be thrown when
 * the users of the API are breaking the properly defined schema of Components.
 *
 * @since 0.0.1
 * @public
 * @class
 */
class UndefinedSchemaException extends Error {
	constructor(...params) {
		super(params);
		this.name = 'UndefinedSchemaException';
	}
}

export default UndefinedSchemaException;
