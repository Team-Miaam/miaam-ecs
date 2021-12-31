/**
 *
 * Interface Error can be thrown
 * when users of the API broke the contract or the critical warnings
 *
 * @since 0.0.1
 * @public
 * @class
 */
class InterfaceError extends Error {
	constructor(...params) {
		super(params);
		this.name = 'InterfaceError';
	}
}

export default InterfaceError;
