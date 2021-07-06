/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import { isValidSchema, checkSchemaProps } from '../../src/utility/Schema.js';
import PrimitiveTypes from '../../src/constants/types/PrimitiveTypes.js';
import InterfaceException from '../../src/exceptions/InterfaceException.js';
import IllegalArgumentException from '../../src/exceptions/IllegalArgumentException.js';

describe('Schema', () => {
	describe('Validation', () => {
		test('schema must not be undefined or null', () => {
			expect(isValidSchema(undefined)).to.be.false;
			expect(isValidSchema(null)).to.be.false;
		});

		test('schema must not be empty', () => {
			expect(isValidSchema({})).to.be.false;
		});

		test('attributes in schema must declare type attribute', () => {
			let position = {
				x: 'y',
				y: {},
			};
			expect(isValidSchema(position)).to.be.false;

			position = {
				x: undefined,
				y: null,
			};
			expect(isValidSchema(position)).to.be.false;

			position = {
				type: {},
				y: null,
			};
			expect(isValidSchema(position)).to.be.false;
		});

		test('type attribute must be instances of Type', () => {
			let position = {
				x: { type: 'int' },
				y: { type: 'int' },
			};
			expect(isValidSchema(position)).to.be.false;

			position = {
				x: { type: 'int' },
				y: { type: PrimitiveTypes.String },
			};
			expect(isValidSchema(position)).to.be.false;

			position = {
				x: { type: PrimitiveTypes.Number },
				y: { type: PrimitiveTypes.Number },
			};
			expect(isValidSchema(position)).to.be.true;

			position = {
				x: { type: PrimitiveTypes.Number },
				y: { type: PrimitiveTypes.String },
				z: { type: PrimitiveTypes.Boolean },
			};
			expect(isValidSchema(position)).to.be.true;
		});
	});

	describe('Validate Props Schema', () => {
		const positionSchema = {
			x: { type: PrimitiveTypes.Number },
			y: { type: PrimitiveTypes.String },
			z: { type: PrimitiveTypes.Boolean },
		};

		test('Props cannot be null neither undefined', () => {
			expect(() => checkSchemaProps(undefined, undefined)).to.throw(
				IllegalArgumentException,
				'props is either null or undefined'
			);
			expect(() => checkSchemaProps(null, null)).to.throw(
				IllegalArgumentException,
				'props is either null or undefined'
			);
			expect(() => checkSchemaProps(positionSchema, null)).to.throw(
				IllegalArgumentException,
				'props is either null or undefined'
			);
			expect(() => checkSchemaProps(undefined, {})).to.throw(
				IllegalArgumentException,
				'props is either null or undefined'
			);
		});

		test('all the property attributes must be defined in the schema', () => {
			let position = { x: 1, y: 2, z: 3, a: 10, b: 20 };
			expect(() => checkSchemaProps(positionSchema, position)).to.throw(
				InterfaceException,
				'attributes are non-compliant with the schema'
			);

			position = { a: 1, b: 2 };
			expect(() => checkSchemaProps(positionSchema, position)).to.throw(
				InterfaceException,
				'attributes are non-compliant with the schema'
			);
		});

		test('Valid props follow the schema compliancy', () => {
			let position = { x: 1, y: 2, z: 3 };
			expect(() => checkSchemaProps(positionSchema, position)).to.not.throw(Error);
			position = { x: 1, y: 2 };
			expect(() => checkSchemaProps(positionSchema, position)).to.not.throw(Error);
			position = {};
			expect(() => checkSchemaProps(positionSchema, position)).to.not.throw(Error);
		});
	});
});
