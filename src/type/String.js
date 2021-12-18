import Type from '../core/Type.js';

const String = new Type({
	name: 'String',
	validdator: (value) => typeof value === 'string',
	clone: (value) => value,
	defaultValue: ' ',
	serialize: (value) => value,
	deserialize: (value) => value, // TODO figure out what returns later
});
export default String;
