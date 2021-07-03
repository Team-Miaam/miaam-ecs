/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import { isValidSchema } from '../../src/utility/Schema.js';
import PrimitiveTypes from '../../src/constants/types/PrimitiveTypes.js';

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
});
