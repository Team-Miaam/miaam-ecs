import Type from '../core/Type.js';

const Boolean = new Type({
	name: 'Boolean',
	validator: (value) => typeof value === 'boolean',
	clone: (value) => value,
	defaultValue: false,
	serialize: (value) => value,
	deserialize: (value) => value, // TODO figure out rteturn value later
});

export default Boolean;
