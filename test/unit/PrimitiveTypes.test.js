/* eslint-disable no-new-wrappers */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import IllegalArgumentException from '../../src/exceptions/IllegalArgumentException.js';
import PrimitiveTypes from '../../src/constants/types/PrimitiveTypes.js';

describe('Primitive Types', () => {
	describe('Boolean', () => {
		test('name', () => {
			expect(PrimitiveTypes.Boolean.getName()).equals('Boolean');
		});

		test('validate', () => {
			expect(PrimitiveTypes.Boolean.validate(true)).to.be.true;
			expect(PrimitiveTypes.Boolean.validate(false)).to.be.true;

			expect(PrimitiveTypes.Boolean.validate(new Boolean(false))).to.be.false;

			expect(PrimitiveTypes.Boolean.validate(37)).to.be.false;
			expect(PrimitiveTypes.Boolean.validate('true')).to.be.false;
			expect(PrimitiveTypes.Boolean.validate({})).to.be.false;
		});

		test('clone', () => {
			expect(PrimitiveTypes.Boolean.clone(true)).to.be.true;
			expect(PrimitiveTypes.Boolean.clone(false)).to.be.false;

			expect(() => {
				PrimitiveTypes.Boolean.clone(37);
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
			expect(() => {
				PrimitiveTypes.Boolean.clone('true');
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
			expect(() => {
				PrimitiveTypes.Boolean.clone({});
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
		});

		test('defaultValue', () => {
			expect(PrimitiveTypes.Boolean.getDefaultValue()).to.be.false;
		});

		test('toString', () => {
			expect(PrimitiveTypes.Boolean.toString()).equals('Type: Boolean');
		});
	});

	describe('Number', () => {
		test('name', () => {
			expect(PrimitiveTypes.Number.getName()).equals('Number');
		});

		test('validate', () => {
			expect(PrimitiveTypes.Number.validate(37)).to.be.true;
			expect(PrimitiveTypes.Number.validate(Number.MAX_VALUE)).to.be.true;

			expect(PrimitiveTypes.Number.validate(new Number(37))).to.be.false;

			expect(PrimitiveTypes.Number.validate(true)).to.be.false;
			expect(PrimitiveTypes.Number.validate('37')).to.be.false;
			expect(PrimitiveTypes.Number.validate({})).to.be.false;
		});

		test('clone', () => {
			expect(PrimitiveTypes.Number.clone(37)).equals(37);
			expect(PrimitiveTypes.Number.clone(Number.MAX_VALUE)).equals(Number.MAX_VALUE);

			expect(() => {
				PrimitiveTypes.Number.clone(true);
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
			expect(() => {
				PrimitiveTypes.Number.clone('37');
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
			expect(() => {
				PrimitiveTypes.Number.clone({});
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
		});

		test('defaultValue', () => {
			expect(PrimitiveTypes.Number.getDefaultValue()).equals(0);
		});

		test('toString', () => {
			expect(PrimitiveTypes.Number.toString()).equals('Type: Number');
		});
	});

	describe('String', () => {
		test('name', () => {
			expect(PrimitiveTypes.String.getName()).equals('String');
		});

		test('validate', () => {
			expect(PrimitiveTypes.String.validate('string')).to.be.true;
			expect(PrimitiveTypes.String.validate('')).to.be.true;

			expect(PrimitiveTypes.String.validate(new String('string'))).to.be.false;

			expect(PrimitiveTypes.String.validate(37)).to.be.false;
			expect(PrimitiveTypes.String.validate(Number.MAX_VALUE)).to.be.false;
			expect(PrimitiveTypes.String.validate(true)).to.be.false;
			expect(PrimitiveTypes.String.validate({})).to.be.false;
		});

		test('clone', () => {
			expect(PrimitiveTypes.String.clone('string')).equals('string');
			expect(PrimitiveTypes.String.clone('hello')).equals('hello');

			expect(() => {
				PrimitiveTypes.String.clone(true);
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
			expect(() => {
				PrimitiveTypes.String.clone(37);
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
			expect(() => {
				PrimitiveTypes.String.clone({});
			}).to.throw(IllegalArgumentException, 'value cannot be validated against this type');
		});

		test('defaultValue', () => {
			expect(PrimitiveTypes.String.getDefaultValue()).equals('');
		});

		test('toString', () => {
			expect(PrimitiveTypes.String.toString()).equals('Type: String');
		});
	});
});
