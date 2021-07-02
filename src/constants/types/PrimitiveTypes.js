import Type from '../../Type.js';

const PrimitiveTypes = {
	Boolean: Type.Create(
		'Boolean',
		(value) => typeof value === 'boolean',
		(value) => value,
		false
	),

	Number: Type.Create(
		'Number',
		(value) => typeof value === 'number',
		(value) => value,
		0
	),

	String: Type.Create(
		'String',
		(value) => typeof value === 'string',
		(value) => value,
		''
	),
};

export default PrimitiveTypes;
