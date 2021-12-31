import { expect } from 'chai';
import { describe, test } from 'mocha';
import Boolean from '../../../src/type/Boolean.js';
import Type from '../../../src/core/Type.js';

describe('Boolean', () => {
	test('Interface', () => {
		test('Boolean is a instance of Type class', () => {
			expect(Boolean).to.instanceOf(Type);
		});
	});
});
