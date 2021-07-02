/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-new */

import { expect } from 'chai';
import { describe, test } from 'mocha';
import IllegalArgumentException from '../../src/exceptions/IllegalArgumentException.js';
import Type from '../../src/Type.js';

describe('Type', () => {
	const typeName = 'NewType';
	function typeValidator(value) {
		return Object.prototype.hasOwnProperty.call(value, 'value');
	}
	const typeClone = (value) => value;
	const typeDefaultValue = {
		value: 'default',
	};

	const NewType = new Type(typeName, typeValidator, typeClone, typeDefaultValue);

	describe('Instantiation', () => {
		test('Newly created type name must be a valid string', () => {
			expect(() => {
				new Type(null, undefined, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'type name is not a valid string');
			expect(() => {
				new Type(undefined, undefined, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'type name is not a valid string');
			expect(() => {
				new Type({}, undefined, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'type name is not a valid string');
		});

		test('Newly created type must have a valid validator method', () => {
			expect(() => {
				new Type(typeName, null, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid validator function');
			expect(() => {
				new Type(typeName, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid validator function');
			expect(() => {
				new Type(typeName, () => {}, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid validator function');
			expect(() => {
				new Type(typeName, (_a, _b) => {}, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid validator function');
		});

		test('Newly created type must have a valid clone method', () => {
			expect(() => {
				new Type(typeName, typeValidator, null, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid clone function');
			expect(() => {
				new Type(typeName, typeValidator, undefined, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid clone function');
			expect(() => {
				new Type(typeName, typeValidator, () => {}, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid clone function');
			expect(() => {
				new Type(typeName, typeValidator, (_a, _b) => {}, undefined);
			}).to.throw(IllegalArgumentException, 'function is not a valid clone function');
		});

		test('Newly created type must have a valid default value', () => {
			expect(() => {
				new Type('NewType', typeValidator, typeClone, undefined);
			}).to.throw(IllegalArgumentException, 'default value is undefined');
			expect(() => {
				new Type('NewType', typeValidator, typeClone, {});
			}).to.throw(IllegalArgumentException, 'default value cannot be validated using provided validator');
			expect(() => {
				new Type('NewType', typeValidator, typeClone, 'abc');
			}).to.throw(IllegalArgumentException, 'default value cannot be validated using provided validator');
		});

		test('Newly created type with valid arguments is not null', () => {
			expect(NewType).to.be.not.null;
		});
	});

	describe('Interface', () => {
		test('Instances of Type must have a getter method for name', () => {
			expect(NewType.getName instanceof Function).to.be.true;
		});

		test('Instances of Type must have access to validate method', () => {
			expect(NewType.validate instanceof Function).to.be.true;
			expect(NewType.validate.length).equals(1);
		});

		test('Instances of Type must have access to clone method', () => {
			expect(NewType.clone instanceof Function).to.be.true;
			expect(NewType.validate.length).equals(1);
		});

		test('Instances of Type must have a getter method for defaultValue', () => {
			expect(NewType.getDefaultValue instanceof Function).to.be.true;
		});

		test('Instances of Type must have a toString method', () => {
			expect(NewType.toString instanceof Function).to.be.true;
		});
	});

	describe('Implementation', () => {
		test('getName', () => {
			expect(NewType.getName()).equals(typeName);
		});

		test('validate', () => {
			expect(NewType.validate({ value: 'value' })).to.be.true;
			expect(NewType.validate({ a: 'b' })).to.be.false;
		});

		test('clone', () => {
			expect(NewType.clone({ value: 'value' })).to.deep.equals({ value: 'value' });
			expect(() => NewType.clone({ a: 'value' })).to.throw(
				IllegalArgumentException,
				'value cannot be validated against this type'
			);
		});

		test('getDefaultString', () => {
			expect(NewType.getDefaultValue()).to.deep.equals(typeDefaultValue);
		});

		test('toString', () => {
			expect(NewType.toString()).equals(`Type: ${typeName}`);
		});
	});

	describe('Reliability', () => {
		let dynamicTypeName = 'NewType';
		let simpleValidator = (_value) => true;
		let jsonSerialization = (value) => JSON.parse(JSON.stringify(value));
		const properType = new Type(dynamicTypeName, simpleValidator, jsonSerialization, typeDefaultValue);

		test('type name must be free from external side effects', () => {
			dynamicTypeName = 'changed';
			expect(properType.getName()).equals('NewType');
		});

		test('validator method must be free from external side effects', () => {
			simpleValidator = (_value) => false;
			expect(properType.validate(typeDefaultValue)).to.be.true;
		});

		test('clone method must be free from external side effects', () => {
			jsonSerialization = (_value) => 1;
			expect(properType.clone(typeDefaultValue)).to.deep.equals(typeDefaultValue);
		});

		test('clone method must be free from external side effects', () => {
			jsonSerialization = (_value) => 1;
			expect(properType.clone(typeDefaultValue)).to.deep.equals(typeDefaultValue);
		});

		test('default value must be a clone of passed argument', () => {
			typeDefaultValue.value = 'changed';
			expect(properType.getDefaultValue().value).equals('default');
		});
	});
});
