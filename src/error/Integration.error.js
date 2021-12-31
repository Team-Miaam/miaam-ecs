/**
 *
 * Integration Error can be thrown
 * when users of the API broke the contract by not fulfilling the preconditions
 *
 * @since 0.0.1
 * @public
 * @class
 */
class IntegrationError extends Error {
	constructor(...params) {
		super(params);
		this.name = 'InterfaceError';
	}
}

export default IntegrationError;
