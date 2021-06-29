/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-new */

import { expect } from 'chai';
import { describe, test } from 'mocha';
import IllegalArgumentException from '../src/exceptions/IllegalArgumentException.js';
import Type from '../src/Type.js';

describe('Type', () => {
	describe('Instantiation of new type', () => {
		test('Newly created type name must be a valid string', () => {
			expect(() => {
				Type.Create(null, null, null);
			}).to.throw(IllegalArgumentException, 'type name is not a valid string');
			expect(() => {
				Type.Create(undefined, null, null);
			}).to.throw(IllegalArgumentException, 'type name is not a valid string');
			expect(() => {
				Type.Create({}, null, null);
			}).to.throw(IllegalArgumentException, 'type name is not a valid string');
		});

		test('Newly created type must have a valid default value', () => {
			expect(() => {
				Type.Create('NewType', (_) => undefined, undefined);
			}).to.throw(IllegalArgumentException, 'default value is undefined');
		});

		test('Newly created type must have a valid clone method', () => {
			expect(() => {
				Type.Create('NewType', null, null);
			}).to.throw(
				IllegalArgumentException,
				'function is not a valid clone function'
			);
			expect(() => {
				Type.Create('NewType', undefined, null);
			}).to.throw(
				IllegalArgumentException,
				'function is not a valid clone function'
			);
			expect(() => {
				Type.Create('NewType', () => {}, null);
			}).to.throw(
				IllegalArgumentException,
				'function is not a valid clone function'
			);
			expect(() => {
				Type.Create('NewType', (_a, _b) => {}, null);
			}).to.throw(
				IllegalArgumentException,
				'function is not a valid clone function'
			);
		});

		test('Newly created type with valid arguments is not null', () => {
			const typeName = 'NewType';
			const defaultValue = {
				value: 'default',
			};
			const naiveCloningMethod = (value) => value;
			const NewType = Type.Create(typeName, naiveCloningMethod, defaultValue);
			expect(NewType).to.be.not.null;
		});
	});

	describe('Type class interface', () => {
		const typeName = 'NewType';
		const defaultValue = {
			value: 'default',
		};
		const naiveCloningMethod = (value) => value;

		const NewType = Type.Create(typeName, naiveCloningMethod, defaultValue);

		test('Instances of Type must have a getter method for name', () => {
			expect(NewType.getName()).equals(typeName);
		});

		test('Instances of Type must have access to clone method', () => {
			expect(NewType.clone instanceof Function).to.be.true;
		});

		test('Instances of Type must have a getter method for defaultValue', () => {
			expect(NewType.getDefaultValue()).deep.equals(defaultValue);
		});
	});

	describe('Type reliability', () => {
		let typeName = 'NewType';
		const defaultValue = {
			value: 'default',
		};
		let jsonSerialization = (value) => JSON.parse(JSON.stringify(value));

		const NewType = Type.Create(typeName, jsonSerialization, defaultValue);

		test('type name must not change from external effects', () => {
			typeName = 'changed';
			expect(NewType.getName()).equals('NewType');
		});

		test('getter of default value must be able to return immutable copy', () => {
			defaultValue.value = 'changed';
			NewType.getDefaultValue().value = 'changed';
			expect(NewType.getDefaultValue().value).equals('default');
		});

		test('clone method must not change from external effects', () => {
			jsonSerialization = (_value) => 1;
			expect(NewType.clone(defaultValue)).to.deep.equals(defaultValue);
		});
	});
});
