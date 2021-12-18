/**
 * Illegal Argument Exception can be thrown
 * when you have some problem with the arguments passed down to your function.
 *
 * @since 0.0.1
 * @public
 * @class
 */
class IllegalArgumentException extends Error {
	constructor(...params) {
		super(params);
		this.name = 'IllegalArgumentException';
	}
}

export default IllegalArgumentException;
