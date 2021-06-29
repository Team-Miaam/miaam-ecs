class IllegalArgumentException extends Error {
	constructor(...params) {
		super(params);
		this.name = 'Illegal Argument Exception';
	}
}

export default IllegalArgumentException;
