/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Number from '../../../src/type/Number.js';
import Type from '../../../src/core/Type.js';

describe('Number', () => {
	test('Interface', () => {
		test('Number is a instance of type class', () => {
			expect(Number).to.instanceOf(Type);
		});
	});

	test('Implementation', () => {
		test('validation', () => {
			expect(Number.validate(12)).to.true;
			expect(Number.validate('12')).to.false;
		});

		test('clone', () => {
			expect(Number.clone(1222)).to.equals(1222);
			expect(Number.clone(1222)).to.not.equals(12);
		});
	});
});
