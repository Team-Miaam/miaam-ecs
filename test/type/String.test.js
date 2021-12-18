import { expect } from 'chai';
import { describe, test } from 'mocha';
import String from '../../src/type/String.js';
import Type from '../../src/core/Type.js';

describe('String', () => {
	test('String is a instance of type class', () => {
		expect(String).to.instanceOf(Type);
	});

	test('Validation function works properly', () => {
		expect(String.validate('north')).to.true;
		expect(String.validate(true)).to.false;
	});

	test('Clone function works properly', () => {
		expect(String.clone('qwert')).to.equals('qwert');
		expect(String.clone('1234')).to.not.equals(1234);
	});
});
