import Type from '../../Type.js';

const PrimitiveTypes = {
	Boolean: new Type(
		'Boolean',
		(value) => typeof value === 'boolean',
		(value) => value,
		false
	),

	Number: new Type(
		'Number',
		(value) => typeof value === 'number',
		(value) => value,
		0
	),

	String: new Type(
		'String',
		(value) => typeof value === 'string',
		(value) => value,
		''
	),
};

export default PrimitiveTypes;
