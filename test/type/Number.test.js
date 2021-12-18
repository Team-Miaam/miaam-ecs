/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { describe, test } from 'mocha';
import Number from '../../src/type/Number.js';
import Type from '../../src/core/Type.js';

describe('Number', () => {
	test('Number is a instance of type class', () => {
		expect(Number).to.instanceOf(Type);
	});
	test('Check validation function for valid', () => {
		expect(Number.validate(12)).to.true;
	});
	test('Check validation function for invalid', () => {
		expect(Number.validate('12')).to.false;
	});
});
