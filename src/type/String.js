import Type from '../core/Type.js';

const String = new Type({
	name: 'String',
	validator: (value) => typeof value === 'string',
	clone: (value) => value,
	defaultValue: '',
	serialize: (value) => value,
	deserialize: (value) => value, // TODO figure out what to return later
});
export default String;
