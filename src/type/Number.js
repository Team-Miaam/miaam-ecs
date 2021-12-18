import Type from '../core/Type.js';

const Number = new Type({
	name: 'Number',
	validator: (value) => typeof value === 'number',
	clone: (value) => value,
	defaultValue: 0,
	serialize: (value) => value,
	deserialize: (value) => value, // TODO figure out what retuns later
});
export default Number;
