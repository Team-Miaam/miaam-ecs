/**
 *
 * Interface Exception can be thrown when
 * when users of the API broke the contract or the critical warnings
 *
 * @since 0.0.1
 * @public
 * @class
 */
class InterfaceException extends Error {
	constructor(...params) {
		super(params);
		this.name = 'InterfaceException';
	}
}

export default InterfaceException;
