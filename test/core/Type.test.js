/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-new */

import { expect } from 'chai';
import { describe, test } from 'mocha';
import IllegalArgumentError from '../../src/error/IllegalArgumentError.js';
import Type from '../../src/core/Type.js';

describe('Type', () => {
	const name = 'newType';
	const validator = (value) => Object.prototype.hasOwnProperty.call(value, 'value');
	const clone = (value) => value;
	const defaultValue = {
		value: 'default',
	};

	const serialize = (obj) => JSON.stringify(obj);
	const deserialize = (value) => JSON.parse(value);

	const newType = new Type({ name, defaultValue, validator, clone, serialize, deserialize });

	describe('Instantiation', () => {
		test('Newly created type name must be a valid string', () => {
			expect(() => {
				new Type({ name: undefined, defaultValue, validator, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'type name is not a valid string');
			expect(() => {
				new Type({ name: null, defaultValue, validator, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'type name is not a valid string');
			expect(() => {
				new Type({ name: {}, defaultValue, validator, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'type name is not a valid string');
		});

		test('Newly created type must have a valid default value', () => {
			expect(() => {
				new Type({ name, defaultValue: undefined, validator, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'default value is undefined');
			expect(() => {
				new Type({ name, defaultValue: null, validator, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'default value cannot be validated using provided validator');
			expect(() => {
				new Type({ name, validator, clone, defaultValue: {}, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'default value cannot be validated using provided validator');
			expect(() => {
				new Type({ name, validator, clone, defaultValue: 'abc', serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'default value cannot be validated using provided validator');
		});

		test('Newly created type must have a valid validator method', () => {
			expect(() => {
				new Type({ name, defaultValue, validator: null, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid validator function');
			expect(() => {
				new Type({ name, defaultValue, validator: undefined, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid validator function');
			expect(() => {
				new Type({ name, defaultValue, validator: () => {}, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid validator function');
			expect(() => {
				new Type({ name, defaultValue, validator: (_a, _b) => {}, clone, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid validator function');
		});

		test('Newly created type must have a valid clone method', () => {
			expect(() => {
				new Type({ name, defaultValue, clone: null, validator, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid clone function');
			expect(() => {
				new Type({ name, defaultValue, clone: undefined, validator, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid clone function');
			expect(() => {
				new Type({ name, defaultValue, clone: () => {}, validator, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid clone function');
			expect(() => {
				new Type({ name, defaultValue, clone: (_a, _b) => {}, validator, serialize, deserialize });
			}).to.throw(IllegalArgumentError, 'function is not a valid clone function');
		});

		test('Newly created type with valid arguments is not null', () => {
			expect(newType).to.be.not.null;
		});
	});

	describe('Interface', () => {
		test('Instances of Type must have a getter method for name', () => {
			expect(typeof newType.name).to.eq('string');
		});

		test('Instances of Type must have a getter method for defaultValue', () => {
			expect(newType.defaultValue).to.exist;
		});

		test('Instances of Type must have access to validate method', () => {
			expect(newType.validate instanceof Function).to.be.true;
			expect(newType.validate.length).equals(1);
		});

		test('Instances of Type must have access to clone method', () => {
			expect(newType.clone instanceof Function).to.be.true;
			expect(newType.clone.length).equals(1);
		});

		test('Instances of Type must have access to serialize method', () => {
			expect(newType.serialize instanceof Function).to.be.true;
			expect(newType.serialize.length).equals(1);
		});

		test('Instances of Type must have access to deserialize method', () => {
			expect(newType.deserialize instanceof Function).to.be.true;
			expect(newType.deserialize.length).equals(1);
		});

		test('Instances of Type must have a toString method', () => {
			expect(newType.toString instanceof Function).to.be.true;
		});
	});

	describe('Implementation', () => {
		test('get name', () => {
			expect(newType.name).equals(name);
		});

		test('validate', () => {
			expect(newType.validate({ value: 'value' })).to.be.true;
			expect(newType.validate({ a: 'b' })).to.be.false;
		});

		test('clone', () => {
			expect(newType.clone({ value: 'value' })).to.deep.equals({ value: 'value' });
			expect(() => newType.clone({ a: 'value' })).to.throw(
				IllegalArgumentError,
				'value cannot be validated against this type'
			);
		});

		test('serialize/deserialize', () => {
			const value = {
				value: 'hi',
			};
			expect(newType.deserialize(newType.serialize(value))).to.deep.equals(value);
		});

		test('get defaultValue', () => {
			expect(newType.defaultValue).to.deep.equals(defaultValue);
		});

		test('toString', () => {
			expect(newType.toString()).equals(`Type: ${name}`);
			expect(`${newType}`).equals(`Type: ${name}`);
		});
	});

	describe('Reliability', () => {
		let dynamicTypeName = 'newType';
		let simpleValidator = (_value) => true;
		const jsonSerialization = (value) => JSON.stringify(value);
		const jsonDeSerialization = (value) => JSON.parse(value);
		let jsonClone = (value) => jsonDeSerialization(jsonSerialization(value));
		const properType = new Type({
			name: dynamicTypeName,
			validator: simpleValidator,
			clone: jsonClone,
			defaultValue,
			serialize: jsonSerialization,
			deserialize: jsonDeSerialization,
		});

		test('type name must be free from external side effects', () => {
			dynamicTypeName = 'changed';
			expect(properType.name).equals('newType');
		});

		test('validator method must be free from external side effects', () => {
			simpleValidator = (_value) => false;
			expect(properType.validate(defaultValue)).to.be.true;
		});

		test('clone method must be free from external side effects', () => {
			jsonClone = (_value) => 1;
			expect(properType.clone(defaultValue)).to.deep.equals(defaultValue);
		});

		test('default value must be a clone of passed argument', () => {
			defaultValue.value = 'changed';
			expect(properType.defaultValue.value).equals('default');
		});

		test('prevent adding new properties to object', () => {
			expect(() => {
				properType.getName = 1;
			}).to.throw(TypeError, 'object is not extensible');
		});
	});
});
