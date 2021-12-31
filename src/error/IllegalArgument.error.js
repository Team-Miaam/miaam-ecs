/**
 * Illegal Argument Error can be thrown
 * when you have some problem with the arguments passed down to your function.
 *
 * @since 0.0.1
 * @public
 * @class
 */
class IllegalArgumentError extends Error {
	constructor(...params) {
		super(params);
		this.name = 'IllegalArgumentError';
	}
}

export default IllegalArgumentError;
